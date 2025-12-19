import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const emisionEjecucionController = container.resolve('emisionEjecucionController');
const router = express.Router();

router
    .get('/emision-ejecucion', useAuth, emisionEjecucionController.get)
    .get('/emision-ejecucion/filter', useAuth, emisionEjecucionController.getByFilter)
    .get('/emision-ejecucion/emision-definicion/:idEmisionDefinicion', useAuth, emisionEjecucionController.getByEmisionDefinicion)
    .get('/emision-ejecucion/:id', useAuth, emisionEjecucionController.getById)
    .post('/emision-ejecucion/mostrador-web/:idCuenta', useAuth, emisionEjecucionController.postMostradorWeb)
    .post('/emision-ejecucion', useAuth, emisionEjecucionController.post)
    .put('/emision-ejecucion/:id', useAuth, emisionEjecucionController.put)
    .put('/emision-ejecucion/start/:id', useAuth, emisionEjecucionController.putStart)
    .put('/emision-ejecucion/continue/:id', useAuth, emisionEjecucionController.putContinue)
    .put('/emision-ejecucion/stop/:id', useAuth, emisionEjecucionController.putStop)
    .put('/emision-ejecucion/pause/:id', useAuth, emisionEjecucionController.putPause)
    .delete('/emision-ejecucion/:id', useAuth, emisionEjecucionController.delete);

export default router;