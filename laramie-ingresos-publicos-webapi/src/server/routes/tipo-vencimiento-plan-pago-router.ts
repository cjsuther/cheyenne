import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const tipoVencimientoPlanPagoController = container.resolve('tipoVencimientoPlanPagoController');
const router = express.Router();

router
	.get('/tipo-vencimiento-plan-pago', useAuth(), tipoVencimientoPlanPagoController.get)
	.get('/tipo-vencimiento-plan-pago/:id', useAuth(), tipoVencimientoPlanPagoController.getById)
	.post('/tipo-vencimiento-plan-pago', useAuth(), tipoVencimientoPlanPagoController.post)
	.put('/tipo-vencimiento-plan-pago/:id', useAuth(), tipoVencimientoPlanPagoController.put)
	.delete('/tipo-vencimiento-plan-pago/:id', useAuth(), tipoVencimientoPlanPagoController.delete);

export default router;