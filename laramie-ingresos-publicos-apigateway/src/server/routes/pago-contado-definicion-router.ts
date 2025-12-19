import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const pagoContadoDefinicionController = container.resolve('pagoContadoDefinicionController');
const router = express.Router();

router
    .get('/pago-contado-definicion', useAuth, pagoContadoDefinicionController.get)
    .get('/pago-contado-definicion/filter', useAuth, pagoContadoDefinicionController.getByFilter)
	.put('/pago-contado-definicion/cuenta/:idCuenta', useAuth, pagoContadoDefinicionController.getByCuenta) //es un get conceptualmente
    .get('/pago-contado-definicion/:id', useAuth, pagoContadoDefinicionController.getById)
	.put('/pago-contado-definicion/:id/cuotas', useAuth, pagoContadoDefinicionController.getByCuotas) //es un get conceptualmente
    .post('/pago-contado-definicion', useAuth, pagoContadoDefinicionController.post)
    .put('/pago-contado-definicion/:id', useAuth, pagoContadoDefinicionController.put)
    .delete('/pago-contado-definicion/:id', useAuth, pagoContadoDefinicionController.delete);

export default router;
