import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const procedimientoController = container.resolve('procedimientoController');
const router = express.Router();

router
    .get('/procedimiento', useAuth(), procedimientoController.get)
    .get('/procedimiento/full/:id', useAuth(), procedimientoController.getFullById)
    .get('/procedimiento/:id', useAuth(), procedimientoController.getById)
    .post('/procedimiento', useAuth(), procedimientoController.post)
    .put('/procedimiento/:id', useAuth(), procedimientoController.put)
    .delete('/procedimiento/:id', useAuth(), procedimientoController.delete);

export default router;