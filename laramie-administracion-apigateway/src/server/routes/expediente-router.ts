import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const expedienteController = container.resolve('expedienteController');
const router = express.Router();

router
    .get('/expediente', useAuth, expedienteController.get)
    .get('/expediente/filter', useAuth, expedienteController.getByFilter)
    .get('/expediente/:id', useAuth, expedienteController.getById)
    .post('/expediente', useAuth, expedienteController.post)
    .put('/expediente/:id', useAuth, expedienteController.put)
    .delete('/expediente/:id', useAuth, expedienteController.delete);

export default router;