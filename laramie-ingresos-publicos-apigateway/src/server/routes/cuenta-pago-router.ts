import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const cuentaPagoController = container.resolve('cuentaPagoController');
const router = express.Router();

router
    .get('/cuenta-pago', useAuth, cuentaPagoController.get)
    .get('/cuenta-pago/:id', useAuth, cuentaPagoController.getById)
    .post('/cuenta-pago/anticipado', useAuth, cuentaPagoController.postAnticipado);

export default router;