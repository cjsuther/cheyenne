import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const emisionEjecucionCuentaController = container.resolve('emisionEjecucionCuentaController');
const router = express.Router();

router
    .get('/emision-ejecucion-cuenta/resume/:idEmisionEjecucion', useAuth(), emisionEjecucionCuentaController.getResume)
	.get('/emision-ejecucion-cuenta/numero/:idEmisionEjecucion/:numero', useAuth(), emisionEjecucionCuentaController.getByNumero)
	.get('/emision-ejecucion-cuenta/cuenta/:idEmisionEjecucion/:idCuenta', useAuth(), emisionEjecucionCuentaController.getByCuenta);

export default router;