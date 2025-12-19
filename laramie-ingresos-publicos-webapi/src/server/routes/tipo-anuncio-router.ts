import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const tipoAnuncioController = container.resolve('tipoAnuncioController');
const router = express.Router();

router
    .get('/tipo-anuncio', useAuth(), tipoAnuncioController.get)
    .get('/tipo-anuncio/:id', useAuth(), tipoAnuncioController.getById)
    .post('/tipo-anuncio', useAuth(), tipoAnuncioController.post)
    .put('/tipo-anuncio/:id', useAuth(), tipoAnuncioController.put)
    .delete('/tipo-anuncio/:id', useAuth(), tipoAnuncioController.delete);

export default router;