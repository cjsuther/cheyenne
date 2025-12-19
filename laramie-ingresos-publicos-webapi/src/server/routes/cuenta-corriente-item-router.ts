import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const cuentaCorrienteItemController = container.resolve('cuentaCorrienteItemController');
const router = express.Router();

router
    .get('/cuenta-corriente-item', useAuth(), cuentaCorrienteItemController.get)
	.get('/cuenta-corriente-item/filter', useAuth(), cuentaCorrienteItemController.getByFilter)
	.get('/cuenta-corriente-item/cuenta/:idCuenta', useAuth(), cuentaCorrienteItemController.getByCuenta)
	.get('/cuenta-corriente-item/contribuyente/:idContribuyente', useAuth(), cuentaCorrienteItemController.getByContribuyente)
	.get('/cuenta-corriente-item/credito/:idCuenta', useAuth(), cuentaCorrienteItemController.getByCredito)
	.get('/cuenta-corriente-item/deuda/:idCuenta', useAuth(), cuentaCorrienteItemController.getByDeuda)
    .get('/cuenta-corriente-item/deuda/:idCuenta/vencimiento/:fechaVencimiento', useAuth(), cuentaCorrienteItemController.getByDeudaVencimiento)
	.put('/cuenta-corriente-item/pago-acuenta', useAuth(), cuentaCorrienteItemController.getByPagoACuenta) //es una consulta pero usa un put para los parametros
	.get('/cuenta-corriente-item/:id', useAuth(), cuentaCorrienteItemController.getById)
	.post('/cuenta-corriente-item/recibo-comun', useAuth(), cuentaCorrienteItemController.postReciboComun)
	.post('/cuenta-corriente-item/pago-recibo-especial', useAuth(), cuentaCorrienteItemController.postPagoReciboEspecial)
	.post('/cuenta-corriente-item/pago-acuenta', useAuth(), cuentaCorrienteItemController.postByPagoACuenta)
	.post('/cuenta-corriente-item/credito', useAuth(), cuentaCorrienteItemController.postCredito)
	.post('/cuenta-corriente-item/debito-credito', useAuth(), cuentaCorrienteItemController.postDebitoCredito);

export default router;