import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const procesoController = container.resolve('procesoController');
const router = express.Router();

router
    .put('/proceso/cancel/:identificador', useAuth, procesoController.putCancel)
    .get('/proceso/verify/:token', procesoController.putVerify) //(*)
    .get('/proceso/execute/:identificador', useAuth, procesoController.putExecute)//(*)
    .get('/proceso/identificador/:identificador', useAuth, procesoController.getByIdentificador)
    .get('/proceso/emision-ejecucion/:idEmisionEjecucion', useAuth, procesoController.getByEmisionEjecucion);
    //(*)ambos metodos son put pero los ponemos como get para poder ejecutarlos desde una url con mayor flexibilidad

export default router;