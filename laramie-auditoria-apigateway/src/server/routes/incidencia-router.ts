import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const incidenciaController = container.resolve('incidenciaController');
const router = express.Router();

router
    .get('/incidencia/filter', useAuth, incidenciaController.getByFilter)
    .get('/incidencia/back/:id', useAuth, incidenciaController.getByBackId)
    .get('/incidencia/forward/:id', useAuth, incidenciaController.getByForwardId)
    .get('/incidencia/:id', useAuth, incidenciaController.getById);

export default router;
