import express from 'express';
import container from '../../infraestructure/ioc/dependency-injection';
import useAuth from '../middlewares/use-auth';

const cajaController = container.resolve('cajaController');
const router = express.Router();

router
	.get('/caja', useAuth, cajaController.get)
	.get('/caja/dependencia/:idDependencia', useAuth, cajaController.getByDependencia)
	.get('/caja/cierre-tesoreria', useAuth, cajaController.getCierreTesoreria)
	.get('/caja/usuario/login', useAuth, cajaController.getUsuarioLogin)
	.get('/caja/resumen/caja-asignacion/:idCajaAsignacion', useAuth, cajaController.getResumenByCajaAsignacion)
	.get('/caja/resumen/:id', useAuth, cajaController.getResumenById)
	.get('/caja/caja-asignacion', useAuth, cajaController.getCajaAsignacion)
	.get('/caja/caja-asignacion/:idCaja', useAuth, cajaController.getCajaAsignacionByIdCaja)
	.get('/caja/:id', useAuth, cajaController.getById)
	.post('/caja', useAuth, cajaController.post)
	.put('/caja/apertura/:id', useAuth, cajaController.putApertura)
	.put('/caja/cierre/:id', useAuth, cajaController.putCierre)
	.put('/caja/movimiento/cobranza/:id', useAuth, cajaController.putMovimientoCobranza)
	.put('/caja/movimiento/retiro/:id', useAuth, cajaController.putMovimientoRetiro)
	.put('/caja/movimiento/ingreso/:id', useAuth, cajaController.putMovimientoIngreso)
	.delete('/caja/movimiento/:idMovimientoCaja', useAuth, cajaController.deleteMovimiento)
	.put('/caja/cierre-tesoreria', useAuth, cajaController.putCierreTesoreria)
	.put('/caja/:id', useAuth, cajaController.put)
	.delete('/caja/:id', useAuth, cajaController.delete);

export default router;