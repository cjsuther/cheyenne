import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const tipoInstrumentoController = container.resolve('tipoInstrumentoController');
const router = express.Router();

router
    .get('/tipo-instrumento', useAuth(), tipoInstrumentoController.get)
    .get('/tipo-instrumento/:id', useAuth(), tipoInstrumentoController.getById)
    .post('/tipo-instrumento', useAuth(), tipoInstrumentoController.post)
    .put('/tipo-instrumento/:id', useAuth(), tipoInstrumentoController.put)
    .delete('/tipo-instrumento/:id', useAuth(), tipoInstrumentoController.delete);

export default router;