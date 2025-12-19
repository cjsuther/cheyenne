import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const procesoController = container.resolve('procesoController');
const router = express.Router();

router
    .put('/proceso/verify', useAuth(), procesoController.putVerify)
    .put('/proceso/execute/:identificador', useAuth(), procesoController.putExecute)
    .put('/proceso/cancel/:identificador', useAuth(), procesoController.putCancel)
    .get('/proceso/identificador/:identificador', useAuth(), procesoController.getByIdentificador)
    .get('/proceso/emision-ejecucion/:idEmisionEjecucion', useAuth(), procesoController.getByEmisionEjecucion);

export default router;