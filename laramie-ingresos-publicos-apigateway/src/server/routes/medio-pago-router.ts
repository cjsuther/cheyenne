import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const medioPagoController = container.resolve('medioPagoController');
const router = express.Router();

router
    .get('/medio-pago/cuenta/:idCuenta', useAuth, medioPagoController.getByCuenta)
    .get('/medio-pago/:id', useAuth, medioPagoController.getById);

export default router;