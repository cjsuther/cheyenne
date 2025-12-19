import express from 'express';
import container from '../../infraestructure/ioc/dependency-injection';
import useAuth from '../middlewares/use-auth';

const recaudacionLoteController = container.resolve('recaudacionLoteController');
const router = express.Router();

router
	.get('/recaudacion-lote', useAuth, recaudacionLoteController.get)
	.get('/recaudacion-lote/detalle/:id', useAuth, recaudacionLoteController.getDetalle)
	.get('/recaudacion-lote/control', useAuth, recaudacionLoteController.getControl)
	.get('/recaudacion-lote/conciliacion', useAuth, recaudacionLoteController.getConciliacion)
	.get('/recaudacion-lote/ingresos-publicos', useAuth, recaudacionLoteController.getIngresosPublicos)
	.get('/recaudacion-lote/registro-contable', useAuth, recaudacionLoteController.getRegistroContable)
	.get('/recaudacion-lote/:id', useAuth, recaudacionLoteController.getById)
	.post('/recaudacion-lote', useAuth, recaudacionLoteController.post)
	.post('/recaudacion-lote/importacion/preview', useAuth, recaudacionLoteController.postImportacionPreview)
	.post('/recaudacion-lote/importacion/confirmacion', useAuth, recaudacionLoteController.postImportacionConfirmacion)
	.put('/recaudacion-lote/control/:id', useAuth, recaudacionLoteController.putControl)
	.put('/recaudacion-lote/conciliacion/manual/:idRecaudacion', useAuth, recaudacionLoteController.putConciliacionManual)
	.put('/recaudacion-lote/ingresos-publicos', useAuth, recaudacionLoteController.putIngresosPublicos)
	.put('/recaudacion-lote/registro-contable', useAuth, recaudacionLoteController.putRegistroContable)
	.put('/recaudacion-lote/:id', useAuth, recaudacionLoteController.put)
	.delete('/recaudacion-lote/:id', useAuth, recaudacionLoteController.delete)

export default router;