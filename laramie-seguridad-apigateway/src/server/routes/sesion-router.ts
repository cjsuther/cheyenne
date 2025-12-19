import express from 'express';
import container from '../../infraestructure/ioc/dependency-injection';
import useAuth from '../middlewares/use-auth';

const sesionController = container.resolve('sesionController');
const router = express.Router();

router
    .put('/sesion/expirate', useAuth, sesionController.expirateSesion)

export default router;