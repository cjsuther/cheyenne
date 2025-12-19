import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const planPagoCuotaController = container.resolve('planPagoCuotaController');
const router = express.Router();

router
	.get('/plan-pago-cuota', useAuth(), planPagoCuotaController.get)
	.get('/plan-pago-cuota/:id', useAuth(), planPagoCuotaController.getById)
	.post('/plan-pago-cuota', useAuth(), planPagoCuotaController.post)
	.put('/plan-pago-cuota/:id', useAuth(), planPagoCuotaController.put)
	.delete('/plan-pago-cuota/:id', useAuth(), planPagoCuotaController.delete);

export default router;