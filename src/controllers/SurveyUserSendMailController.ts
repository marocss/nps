import { Request, Response } from 'express'
import { resolve } from "path"
import { getCustomRepository } from 'typeorm'
import { AppError } from '../errors/AppError'
import { SurveysRepository } from '../repositories/SurveysRepository'
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository'
import { UsersRepository } from '../repositories/UsersRepository'
import SendMailService from '../services/SendMailService'


// TODO: bug - it sends survey again if user already answered
class SurveyUserSendMailController {
  async create(request: Request, response: Response) {
    const { email, survey_id } = request.body
    
    const usersRepository = getCustomRepository(UsersRepository)
    const surveysRepository = getCustomRepository(SurveysRepository)
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

    const user = await usersRepository.findOne({email})
    if(!user) {
      throw new AppError('User doesn\'t exist');
      // return response.status(400).json({error: 'User doesn\'t exist'})
    }
    
    const survey = await surveysRepository.findOne({ id: survey_id })
    if(!survey) {
      throw new AppError('Survey doesn\'t exist');
      // return response.status(400).json({error: 'Survey doesn\'t exist'})
    }


    const npsMailPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs')

    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      user_id: user.id,
      surveyUser_id: "",
      link: process.env.URL_MAIL
    }

    const surveyUser = await surveysUsersRepository.findOne({
      where: {user_id: user.id, value: null},
      relations: ['user', 'survey']
    })
    // // where user.ir or value null
    // const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
    //   where: [{user_id: user.id}, {value: null}],
    //   relations: ['user', 'survey']
    // })
    
    if(surveyUser) {
      variables.surveyUser_id = surveyUser.id
      console.log('====================================');
      console.log('survey exists and value is null');
      console.log('====================================');
      await SendMailService.execute(email, survey.title, variables, npsMailPath)
      return response.json(surveyUser)
    }
    

    console.log('====================================');
    console.log('survey does not exist');
    console.log('====================================');

    const user_id = user.id
    const newSurveyUser = surveysUsersRepository.create({ user_id, survey_id })
    
    await surveysUsersRepository.save(newSurveyUser)

    variables.surveyUser_id = newSurveyUser.id

    await SendMailService.execute(email, survey.title, variables, npsMailPath)
    
    return response.status(201).json(newSurveyUser)
  }

  // async show(request: Request, response: Response) {
  //   const surveysRepository = getCustomRepository(SurveysRepository)
    
  //   const all = await surveysRepository.find()

  //   return response.json(all)
  // }
}

export { SurveyUserSendMailController }
