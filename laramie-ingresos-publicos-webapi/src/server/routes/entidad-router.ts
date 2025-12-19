import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const entidadController = container.resolve('entidadController');
const router = express.Router();

router
    .get('/entidad/definicion', useAuth(), entidadController.getByDefinicion)
    .get('/entidad/:tipo', useAuth(), entidadController.getByTipo);

export default router;