import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const plantillaDocumentoController = container.resolve('plantillaDocumentoController');
const router = express.Router();

router
    .get('/plantilla-documento', useAuth(), plantillaDocumentoController.get)
    .get('/plantilla-documento/tipo-plantilla-documento/:idTipoPlantillaDocumento', useAuth(), plantillaDocumentoController.getByTipoPlantillaDocumento)
    .get('/plantilla-documento/tipo-acto-procesal/:idTipoActoProcesal', useAuth(), plantillaDocumentoController.getByTipoActoProcesal)
    .get('/plantilla-documento/:id', useAuth(), plantillaDocumentoController.getById)
    .post('/plantilla-documento', useAuth(), plantillaDocumentoController.post)
    .put('/plantilla-documento/:id', useAuth(), plantillaDocumentoController.put)
    .delete('/plantilla-documento/:id', useAuth(), plantillaDocumentoController.delete);

export default router;