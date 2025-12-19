import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const entidadController = container.resolve('entidadController');
const router = express.Router();

router
    .get('/entidad/:tipos', useAuth, entidadController.getByTipos);

export default router;