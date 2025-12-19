import express from 'express';
import container from '../../infraestructure/ioc/dependency-injection';
import useAuth from '../middlewares/use-auth';

const registroContableLoteController = container.resolve('registroContableLoteController');
const router = express.Router();

router
	.get('/registro-contable-lote', useAuth(['registro-contable-lote_view']), registroContableLoteController.get)
	.get('/registro-contable-lote/:id', useAuth(['registro-contable-lote_view']), registroContableLoteController.getById)
	.get('/registro-contable-lote/detalle/:id', useAuth(['registro-contable-lote_view']), registroContableLoteController.getDetalle)
	// .post('/registro-contable-lote', useAuth(['registro-contable-lote_edit']), registroContableLoteController.post)
	// .put('/registro-contable-lote/:id', useAuth(['registro-contable-lote_edit']), registroContableLoteController.put)
	// .delete('/registro-contable-lote/:id', useAuth(['registro-contable-lote_edit']), registroContableLoteController.delete)

export default router;