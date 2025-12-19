import express from 'express';
import container from '../../infraestructure/ioc/dependency-injection';

const boletaController = container.resolve('boletaController');
const router = express.Router();

router
    .get('/boleta/:identificador', boletaController.get);

export default router;