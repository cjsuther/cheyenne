import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const localidadController = container.resolve('localidadController');
const router = express.Router();

router
    .get('/localidad', useAuth(), localidadController.get)
    .get('/localidad/:id', useAuth(), localidadController.getById)
    .post('/localidad', useAuth(), localidadController.post)
    .put('/localidad/:id', useAuth(), localidadController.put)
    .delete('/localidad/:id', useAuth(), localidadController.delete);

export default router;