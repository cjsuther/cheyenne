import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const cuentaCorrienteCondicionEspecialController = container.resolve('cuentaCorrienteCondicionEspecialController');
const router = express.Router();

router
	.get('/cuenta-corriente-condicion-especial', useAuth(), cuentaCorrienteCondicionEspecialController.get)
	.get('/cuenta-corriente-condicion-especial/cuenta/:idCuenta', useAuth(), cuentaCorrienteCondicionEspecialController.getByCuenta)
	.get('/cuenta-corriente-condicion-especial/:id', useAuth(), cuentaCorrienteCondicionEspecialController.getById)
	.post('/cuenta-corriente-condicion-especial', useAuth(), cuentaCorrienteCondicionEspecialController.post)
	.put('/cuenta-corriente-condicion-especial/:id', useAuth(), cuentaCorrienteCondicionEspecialController.put)
	.delete('/cuenta-corriente-condicion-especial/:id', useAuth(), cuentaCorrienteCondicionEspecialController.delete);

export default router;