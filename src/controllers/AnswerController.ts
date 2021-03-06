import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { AppError } from '../errors/AppError'
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository'


class AnswerController {
  // link structure: http://localhost:3333/answers/10?u=2dc5b3b5-30b3-4e89-a799-f062fd7679c0&s=e2593225-c192-49db-915c-4cb608747fb8
  async execute(request: Request, response: Response) {
    const { value } = request.params
    const { u, s } = request.query
    
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)
    
    const surveyUser = await surveysUsersRepository.findOne({ id: String(s) })

    if (!surveyUser) {
      throw new AppError("Survey User does not exist.");
      
      // return response.status(400).json({
      //   error: "Survey User does not exist."
      // })
    }

    surveyUser.value = Number(value)

    await surveysUsersRepository.save(surveyUser)

    return response.status(200).json(surveyUser)
  }
}

export { AnswerController }
