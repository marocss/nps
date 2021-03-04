import { Router } from "express";
import { SurveysController } from "./controllers/SurveysController";
import { UserController } from "./controllers/UserController";
import { SurveyUserSendMailController } from "./controllers/SurveyUserSendMailController";

const router = Router()

const userController = new UserController
const surveysController = new SurveysController
const surveyUserSendMailController = new SurveyUserSendMailController

router.post('/users', userController.create);

router.post('/surveys', surveysController.create);
router.get('/surveys', surveysController.show);

router.post('/sendmail', surveyUserSendMailController.create);

export { router };

