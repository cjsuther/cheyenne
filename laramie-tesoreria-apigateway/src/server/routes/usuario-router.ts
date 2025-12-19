import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const usuarioController = container.resolve('usuarioController');
const router = express.Router();

router
    .get('/usuario', useAuth, usuarioController.get)
    .get('/usuario/:id', useAuth, usuarioController.getById);

export default router;