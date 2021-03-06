import { Router } from "express";
import { AnswerController } from "./controllers/AnswerController";
import { NpsController } from "./controllers/NpsController";
import { SurveysController } from "./controllers/SurveysController";
import { SurveyUserSendMailController } from "./controllers/SurveyUserSendMailController";
import { UserController } from "./controllers/UserController";

const router = Router()

const userController = new UserController
const surveysController = new SurveysController
const surveyUserSendMailController = new SurveyUserSendMailController
const answerController = new AnswerController
const npsController = new NpsController

router.post('/users', userController.create);

router.post('/surveys', surveysController.create);
router.get('/surveys', surveysController.show);

router.post('/sendmail', surveyUserSendMailController.create);

router.get('/answers/:value', answerController.execute);

router.get('/nps/:survey_id', npsController.execute);

export { router };

