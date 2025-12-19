import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const listaController = container.resolve('listaController');
const router = express.Router();

router
    .get('/lista/:tipo', useAuth(), listaController.getByTipo)
    .get('/lista/:tipo/:id', useAuth(), listaController.getById)
    .post('/lista/:tipo', useAuth(), listaController.post)
    .put('/lista/:tipo/:id', useAuth(), listaController.put)
    .delete('/lista/:tipo/:id', useAuth(), listaController.delete);

export default router;