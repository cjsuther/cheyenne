import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const listaController = container.resolve('listaController');
const router = express.Router();

router
    .get('/lista/:tipo', useAuth(), listaController.getByTipo);

export default router;