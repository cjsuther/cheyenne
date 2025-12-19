import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const verificacionController = container.resolve('verificacionController');
const router = express.Router();

router
    //.get('/verificacion', useAuth(), verificacionController.get)
    //.get('/verificacion/:id', useAuth(), verificacionController.getById)
    .get('/verificacion/token/:token', verificacionController.verifyPasswordToken)
    .post('/verificacion', useAuth(), verificacionController.post)
    //.put('/verificacion/:id', useAuth(), verificacionController.put)
    //.delete('/verificacion/:id', useAuth(), verificacionController.delete);

export default router;
