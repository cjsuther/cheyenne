import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const tipoActoProcesalController = container.resolve('tipoActoProcesalController');
const router = express.Router();

router
    .get('/tipo-acto-procesal', useAuth(), tipoActoProcesalController.get)
    .get('/tipo-acto-procesal/:id', useAuth(), tipoActoProcesalController.getById)
    .post('/tipo-acto-procesal', useAuth(), tipoActoProcesalController.post)
    .put('/tipo-acto-procesal/:id', useAuth(), tipoActoProcesalController.put)
    .put('/tipo-acto-procesal/:id/plantilla-documento', useAuth(), tipoActoProcesalController.putPlantillasDocumentos)
    .delete('/tipo-acto-procesal/:id', useAuth(), tipoActoProcesalController.delete);

export default router;