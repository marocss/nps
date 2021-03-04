import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { SurveysRepository } from '../repositories/SurveysRepository'
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository'
import { UsersRepository } from '../repositories/UsersRepository'
import SendMailService from '../services/SendMailService'
import { resolve } from "path";



class SurveyUserSendMailController {
  async create(request: Request, response: Response) {
    const { email, survey_id } = request.body
    
    const usersRepository = getCustomRepository(UsersRepository)
    const surveysRepository = getCustomRepository(SurveysRepository)
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

    const user = await usersRepository.findOne({email})
    if(!user) {
      return response.status(400).json({error: 'User doesn\'t exist'})
    }
    
    const survey = await surveysRepository.findOne({ id: survey_id })
    if(!survey) {
      return response.status(400).json({error: 'Survey doesn\'t exist'})
    }


    const npsMailPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs')

    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      user_id: user.id,
      link: process.env.URL_MAIL
    }

    const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
      where: [{user_id: user.id}, {value: null}],
      relations: ['user', 'survey']
    })
    
    if(surveyUserAlreadyExists) {
      await SendMailService.execute(email, survey.title, variables, npsMailPath)
      return response.json(surveyUserAlreadyExists)
    }
    

    const user_id = user.id
    const surveyUser = surveysUsersRepository.create({ user_id, survey_id })
    
    await surveysUsersRepository.save(surveyUser)

    await SendMailService.execute(email, survey.title, variables, npsMailPath)
    
    return response.status(201).json(surveyUser)
  }

  // async show(request: Request, response: Response) {
  //   const surveysRepository = getCustomRepository(SurveysRepository)
    
  //   const all = await surveysRepository.find()

  //   return response.json(all)
  // }
}

export { SurveyUserSendMailController }
