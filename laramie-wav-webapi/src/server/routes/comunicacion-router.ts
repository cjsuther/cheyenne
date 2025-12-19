import express from 'express';
import container from '../../infraestructure/ioc/dependency-injection';
import useAuth from '../middlewares/use-auth';

const comunicacionController = container.resolve('comunicacionController');
const router = express.Router();

router
    .post('/comunicacion/e-mail', useAuth, comunicacionController.postEMail);

export default router;