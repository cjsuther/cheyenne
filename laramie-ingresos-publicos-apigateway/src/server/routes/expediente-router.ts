import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const expedienteController = container.resolve('expedienteController');
const router = express.Router();

router
    .get('/expediente/filter', useAuth, expedienteController.getByFilter)
    .get('/expediente/:id', useAuth, expedienteController.getById);

export default router;