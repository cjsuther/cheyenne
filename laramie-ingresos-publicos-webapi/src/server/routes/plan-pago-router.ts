import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const planPagoController = container.resolve('planPagoController');
const router = express.Router();

router
	.get('/plan-pago', useAuth(), planPagoController.get)
	.get('/plan-pago/:id', useAuth(), planPagoController.getById)
	.get('/plan-pago/cuenta/:idCuenta', useAuth(), planPagoController.getByCuenta)
	.post('/plan-pago', useAuth(), planPagoController.post)
	.put('/plan-pago/caducidad', useAuth(), planPagoController.putCaducidad)
	.put('/plan-pago/:id', useAuth(), planPagoController.put)
	.delete('/plan-pago/:id/caducidad', useAuth(), planPagoController.deleteCaducidad)
	.delete('/plan-pago/:id', useAuth(), planPagoController.delete);

export default router;