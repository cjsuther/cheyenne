import express from 'express';
import container from '../../infraestructure/ioc/dependency-injection';
import useAuth from '../middlewares/use-auth';

const reciboPublicacionLoteController = container.resolve('reciboPublicacionLoteController');
const router = express.Router();

router
	.get('/recibo-publicacion-lote', useAuth(['recibo-publicacion-lote_view']), reciboPublicacionLoteController.get)
	.get('/recibo-publicacion-lote/recibo/numero/:codigoDelegacion/:numeroRecibo', useAuth(['recibo-publicacion_view']), reciboPublicacionLoteController.getReciboByNumero)
	.get('/recibo-publicacion-lote/recibo/codigo-barras-cliente/:codigoBarrasCliente', useAuth(['recibo-publicacion_view']), reciboPublicacionLoteController.getReciboReciboByCodigoBarrasCliente)
	.get('/recibo-publicacion-lote/:id', useAuth(['recibo-publicacion-lote_view']), reciboPublicacionLoteController.getById)
	// por ahora se hace solo de manera automatica desde ingresos publicos via rabbit
	// .post('/recibo-publicacion-lote', useAuth(['recibo-publicacion-lote_edit']), reciboPublicacionLoteController.post)
	// .put('/recibo-publicacion-lote/:id', useAuth(['recibo-publicacion-lote_edit']), reciboPublicacionLoteController.put)
	// .delete('/recibo-publicacion-lote/:id', useAuth(['recibo-publicacion-lote_edit']), reciboPublicacionLoteController.delete)

export default router;