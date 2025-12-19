import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const listaController = container.resolve('listaController');
const router = express.Router();

router
    .get('/lista', useAuth, listaController.get)
    .get('/lista/:id', useAuth, listaController.getById)
    .post('/lista', useAuth, listaController.post)
    .put('/lista/:id', useAuth, listaController.put)
    .delete('/lista/:id', useAuth, listaController.delete);

export default router;
