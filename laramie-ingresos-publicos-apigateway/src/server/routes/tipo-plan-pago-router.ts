import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const tipoPlanPagoController = container.resolve('tipoPlanPagoController');
const router = express.Router();

router
	.get('/tipo-plan-pago', useAuth, tipoPlanPagoController.get)
	.get('/tipo-plan-pago/:id', useAuth, tipoPlanPagoController.getById)
	.post('/tipo-plan-pago', useAuth, tipoPlanPagoController.post)
	.put('/tipo-plan-pago/:id', useAuth, tipoPlanPagoController.put)
	.delete('/tipo-plan-pago/:id', useAuth, tipoPlanPagoController.delete);
export default router;