import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const cuentaPagoItemController = container.resolve('cuentaPagoItemController');
const router = express.Router();

router
    .get('/cuenta-pago-item', useAuth(), cuentaPagoItemController.get)
    .get('/cuenta-pago-item/:id', useAuth(), cuentaPagoItemController.getById)
    .post('/cuenta-pago-item', useAuth(), cuentaPagoItemController.post)
    .put('/cuenta-pago-item/:id', useAuth(), cuentaPagoItemController.put)
    .delete('/cuenta-pago-item/:id', useAuth(), cuentaPagoItemController.delete);

export default router;