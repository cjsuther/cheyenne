import express from 'express';
import container from '../../infraestructure/ioc/dependency-injection';
import useAuth from '../middlewares/use-auth';

const reciboPublicacionLoteController = container.resolve('reciboPublicacionLoteController');
const router = express.Router();

router
	// .get('/recibo-publicacion-lote', useAuth, reciboPublicacionLoteController.get)
	.get('/recibo-publicacion-lote/recibo/numero/:codigoDelegacion/:numeroRecibo', useAuth, reciboPublicacionLoteController.getReciboByNumero)
	.get('/recibo-publicacion-lote/recibo/codigo-barras-cliente/:codigoBarrasCliente', useAuth, reciboPublicacionLoteController.getReciboByCodigoBarrasCliente)
	// .get('/recibo-publicacion-lote/:id', useAuth, reciboPublicacionLoteController.getById)
	// .post('/recibo-publicacion-lote', useAuth, reciboPublicacionLoteController.post)
	// .put('/recibo-publicacion-lote/:id', useAuth, reciboPublicacionLoteController.put)
	// .delete('/recibo-publicacion-lote/:id', useAuth, reciboPublicacionLoteController.delete)

export default router;