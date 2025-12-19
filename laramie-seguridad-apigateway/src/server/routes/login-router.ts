import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';

const loginController = container.resolve('loginController');
const router = express.Router();

router
    .post('/login', loginController.post);

export default router;