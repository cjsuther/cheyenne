import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const planPagoDefinicionController = container.resolve('planPagoDefinicionController');
const router = express.Router();

router
	.get('/plan-pago-definicion', useAuth, planPagoDefinicionController.get)
	.get('/plan-pago-definicion/filter', useAuth, planPagoDefinicionController.getByFilter)
	.put('/plan-pago-definicion/cuenta/:idCuenta', useAuth, planPagoDefinicionController.getByCuenta) //es un get conceptualmente
	.get('/plan-pago-definicion/:id', useAuth, planPagoDefinicionController.getById)
	.put('/plan-pago-definicion/:id/cuotas', useAuth, planPagoDefinicionController.getByCuotas) //es un get conceptualmente
	.post('/plan-pago-definicion', useAuth, planPagoDefinicionController.post)
	.put('/plan-pago-definicion/:id', useAuth, planPagoDefinicionController.put)
	.delete('/plan-pago-definicion/:id', useAuth, planPagoDefinicionController.delete);

export default router;