import express from 'express';
import container from '../../infraestructure/ioc/dependency-injection';
import useAuth from '../middlewares/use-auth';

const pagoRendicionLoteController = container.resolve('pagoRendicionLoteController');
const router = express.Router();

router
	.get('/pago-rendicion-lote', useAuth(['pago-rendicion-lote_view']), pagoRendicionLoteController.get)
	.get('/pago-rendicion-lote/:id', useAuth(['pago-rendicion-lote_view']), pagoRendicionLoteController.getById)
	.get('/pago-rendicion-lote/detalle/:id', useAuth(['pago-rendicion-lote_view']), pagoRendicionLoteController.getDetalle)
	// .post('/pago-rendicion-lote', useAuth(['pago-rendicion-lote_edit']), pagoRendicionLoteController.post)
	// .put('/pago-rendicion-lote/:id', useAuth(['pago-rendicion-lote_edit']), pagoRendicionLoteController.put)
	// .delete('/pago-rendicion-lote/:id', useAuth(['pago-rendicion-lote_edit']), pagoRendicionLoteController.delete)

export default router;