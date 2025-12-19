import express from 'express';
import container from '../../infraestructure/ioc/dependency-injection';
import useAuth from '../middlewares/use-auth';

const recaudacionLoteController = container.resolve('recaudacionLoteController');
const router = express.Router();

router
	.get('/recaudacion-lote', useAuth(['recaudacion-lote_view']), recaudacionLoteController.get)
	.get('/recaudacion-lote/detalle/:id', useAuth(['recaudacion-lote_view']), recaudacionLoteController.getDetalle)
	.get('/recaudacion-lote/control', useAuth(['recaudacion-lote_view']), recaudacionLoteController.getControl)
	.get('/recaudacion-lote/conciliacion', useAuth(['recaudacion-lote_view']), recaudacionLoteController.getConciliacion)
	.get('/recaudacion-lote/ingresos-publicos', useAuth(['recaudacion-lote_view']), recaudacionLoteController.getIngresosPublicos)
	.get('/recaudacion-lote/registro-contable', useAuth(['recaudacion-lote_view']), recaudacionLoteController.getRegistroContable)
	.get('/recaudacion-lote/:id', useAuth(['recaudacion-lote_view']), recaudacionLoteController.getById)
	.post('/recaudacion-lote', useAuth(['recaudacion-lote_edit']), recaudacionLoteController.post)
	.post('/recaudacion-lote/importacion/preview', useAuth(['recaudacion-lote_edit']), recaudacionLoteController.postImportacionPreview)
	.post('/recaudacion-lote/importacion/confirmacion', useAuth(['recaudacion-lote_edit']), recaudacionLoteController.postImportacionConfirmacion)
	.put('/recaudacion-lote/control/:id', useAuth(['recaudacion-lote_control']), recaudacionLoteController.putControl)
	.put('/recaudacion-lote/conciliacion/manual/:idRecaudacion', useAuth(['recaudacion-lote_conciliacion']), recaudacionLoteController.putConciliacionManual)
	.put('/recaudacion-lote/ingresos-publicos', useAuth(['pago-rendicion-lote_edit']), recaudacionLoteController.putIngresosPublicos)
	.put('/recaudacion-lote/registro-contable', useAuth(['registro-contable-lote_edit']), recaudacionLoteController.putRegistroContable)
	.put('/recaudacion-lote/:id', useAuth(['recaudacion-lote_edit']), recaudacionLoteController.put)
	.delete('/recaudacion-lote/:id', useAuth(['recaudacion-lote_edit']), recaudacionLoteController.delete)

export default router;