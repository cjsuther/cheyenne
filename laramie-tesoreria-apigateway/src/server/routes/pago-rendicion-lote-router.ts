import express from 'express';
import container from '../../infraestructure/ioc/dependency-injection';
import useAuth from '../middlewares/use-auth';

const pagoRendicionLoteController = container.resolve('pagoRendicionLoteController');
const router = express.Router();

router
	.get('/pago-rendicion-lote', useAuth, pagoRendicionLoteController.get)
	.get('/pago-rendicion-lote/detalle/:id', useAuth, pagoRendicionLoteController.getByDetalle)

export default router;