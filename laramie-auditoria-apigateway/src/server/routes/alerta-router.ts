import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const alertaController = container.resolve('alertaController');
const router = express.Router();

router
    .get('/alerta/filter', useAuth, alertaController.getByFilter)
    .get('/alerta/back/:id', useAuth, alertaController.getByBackId)
    .get('/alerta/forward/:id', useAuth, alertaController.getByForwardId)
    .get('/alerta/:id', useAuth, alertaController.getById);

export default router;
