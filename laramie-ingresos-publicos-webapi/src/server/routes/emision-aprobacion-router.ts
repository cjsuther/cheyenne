import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const emisionAprobacionController = container.resolve('emisionAprobacionController');
const router = express.Router();

router
    .get('/emision-aprobacion/emision-ejecucion/:idEmisionEjecucion', useAuth(), emisionAprobacionController.getByEmisionEjecucion)
    .get('/emision-aprobacion/:id', useAuth(), emisionAprobacionController.getById)
    .put('/emision-aprobacion/:id/:action', useAuth(), emisionAprobacionController.put)
    .put('/emision-aprobacion/async/:id/:action/:fechaProceso', useAuth(), emisionAprobacionController.putAsync);

export default router;