import express from 'express';
import container from '../../infraestructure/ioc/dependency-injection';
import useAuth from '../middlewares/use-auth';

const cajaController = container.resolve('cajaController');
const router = express.Router();

router
	.get('/caja', useAuth(['caja_view']), cajaController.get)
	.get('/caja/dependencia/:idDependencia', useAuth(['caja_view']), cajaController.getByDependencia)
	.get('/caja/cierre-tesoreria', useAuth(['caja_view']), cajaController.getCierreTesoreria)
	.get('/caja/usuario/:idUsuario', useAuth(['caja_view']), cajaController.getByUsuario)
	.get('/caja/resumen/caja-asignacion/:idCajaAsignacion', useAuth(['caja_view']), cajaController.getResumenByCajaAsignacion)
	.get('/caja/resumen/:id', useAuth(['caja_view']), cajaController.getResumenById)
	.get('/caja/caja-asignacion', useAuth(['caja_view']), cajaController.getCajaAsignacion)	
	.get('/caja/caja-asignacion/:idCaja', useAuth(['caja_view']), cajaController.getCajaAsignacionByIdCaja)	
	.get('/caja/:id', useAuth(['caja_view']), cajaController.getById)
	.post('/caja', useAuth(['caja_edit']), cajaController.post)
	.put('/caja/apertura/:id', useAuth(['caja_cobro']), cajaController.putApertura)
	.put('/caja/cierre/:id', useAuth(['caja_cobro']), cajaController.putCierre)
	.put('/caja/movimiento/cobranza/:id', useAuth(['caja_cobro']), cajaController.putMovimientoCobranza)
	.put('/caja/movimiento/retiro/:id', useAuth(['caja_cobro']), cajaController.putMovimientoRetiro)
	.put('/caja/movimiento/ingreso/:id', useAuth(['caja_cobro']), cajaController.putMovimientoIngreso)
	.delete('/caja/movimiento/:idMovimientoCaja', useAuth(['caja_cobro']), cajaController.deleteMovimiento)
	.put('/caja/cierre-tesoreria', useAuth(['cierre-tesoreria_edit']), cajaController.putCierreTesoreria)
	.put('/caja/:id', useAuth(['caja_edit']), cajaController.put)
	.delete('/caja/:id', useAuth(['caja_edit']), cajaController.delete)

export default router;