import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const cuentaController = container.resolve('cuentaController');
const router = express.Router();

router
    .get('/cuenta/', useAuth(), cuentaController.get)
    .get('/cuenta/filter', useAuth(), cuentaController.getByFilter)
    .get('/cuenta/persona/:idPersona', useAuth(), cuentaController.getByPersona)
    .get('/cuenta/contribuyente/:idContribuyente', useAuth(), cuentaController.getByContribuyente)
    .get('/cuenta/:id', useAuth(), cuentaController.getById)
    .get('/cuenta/data/:id', useAuth(), cuentaController.getDataById)
    .put('/cuenta/baja/:id', useAuth(), cuentaController.putBajaById);

export default router;