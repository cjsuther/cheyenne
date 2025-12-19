import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const pagoContadoController = container.resolve('pagoContadoController');
const router = express.Router();

router
	.post('/pago-contado', useAuth, pagoContadoController.post);

export default router;