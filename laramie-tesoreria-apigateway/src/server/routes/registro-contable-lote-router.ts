import express from 'express';
import container from '../../infraestructure/ioc/dependency-injection';
import useAuth from '../middlewares/use-auth';

const registroContableLoteController = container.resolve('registroContableLoteController');
const router = express.Router();

router
	.get('/registro-contable-lote', useAuth, registroContableLoteController.get)
	.get('/registro-contable-lote/detalle/:id', useAuth, registroContableLoteController.getByDetalle)

export default router;