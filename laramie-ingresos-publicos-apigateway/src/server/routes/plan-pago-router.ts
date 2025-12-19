import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const planPagoController = container.resolve('planPagoController');
const router = express.Router();

router
	.get('/plan-pago', useAuth, planPagoController.get)
	.get('/plan-pago/:id', useAuth, planPagoController.getById)
	.get('/plan-pago/cuenta/:idCuenta', useAuth, planPagoController.getByCuenta)
	.post('/plan-pago', useAuth, planPagoController.post)
	.put('/plan-pago/caducidad', useAuth, planPagoController.putCaducidad);

export default router;