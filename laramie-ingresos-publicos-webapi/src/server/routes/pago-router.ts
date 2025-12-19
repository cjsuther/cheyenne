import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const pagoController = container.resolve('pagoController');
const router = express.Router();

router
	.put('/pago/pago-anticipado/:id', useAuth(), pagoController.putPagoAnticipado);

export default router;