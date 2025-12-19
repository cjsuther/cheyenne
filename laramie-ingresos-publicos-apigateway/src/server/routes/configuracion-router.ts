import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const configuracionController = container.resolve('configuracionController');
const router = express.Router();

router
    .get('/configuracion/:nombre', useAuth, configuracionController.getByNombre);

export default router;