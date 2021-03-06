import { Request, Response } from 'express'
import { getCustomRepository, IsNull, Not } from 'typeorm'
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository'


class NpsController {
  // calculo nps
  // notas: 1 2 3 4 5 6 7 8 9 10
  // detratores = 0 - 6
  // passivos = 7 - 8
  // promotores = 9 - 10

  // ((promotores - detratores) / respostas ) * 100
  async execute(request: Request, response: Response) {
    const { survey_id } = request.params
    
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)
    
    const surveysUsers = await surveysUsersRepository.find({ 
      survey_id, 
      value: Not(IsNull())
    })

    const detractors = surveysUsers.filter(
      (survey) => survey.value >= 0 && survey.value <= 6
    ).length
    const passives = surveysUsers.filter(
      (survey) => survey.value >= 7 && survey.value <= 8
    ).length
    const promoters = surveysUsers.filter(
      (survey) => survey.value >= 9 && survey.value <= 10
    ).length
    const totalAnswers = surveysUsers.length

    const nps = ((promoters - detractors) / totalAnswers)
      .toLocaleString('pt-BR',{style: 'percent', minimumFractionDigits:2})

    return response.status(200).json({
      detractors,
      passives,
      promoters,
      totalAnswers, 
      nps
    })
  }
}

export { NpsController }
