import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const tipoMovimientoController = container.resolve('tipoMovimientoController');
const router = express.Router();

router
    .get('/tipo-movimiento', useAuth(), tipoMovimientoController.get)
    .get('/tipo-movimiento/:id', useAuth(), tipoMovimientoController.getById)
    .get('/tipo-movimiento/codigo/:id', useAuth(), tipoMovimientoController.getByCodigo)
    .post('/tipo-movimiento', useAuth(), tipoMovimientoController.post)
    .put('/tipo-movimiento/:id', useAuth(), tipoMovimientoController.put)
    .delete('/tipo-movimiento/:id', useAuth(), tipoMovimientoController.delete)

export default router;