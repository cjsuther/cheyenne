import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const direccionController = container.resolve('direccionController');
const router = express.Router();

router
    .get('/direccion', useAuth(), direccionController.get)
    .get('/direccion/entidad/:entidad/:idEntidad', useAuth(), direccionController.getByEntidad)
    .get('/direccion/:id', useAuth(), direccionController.getById)
    .post('/direccion', useAuth(), direccionController.post)
    .put('/direccion/:id', useAuth(), direccionController.put)
    .delete('/direccion/:id', useAuth(), direccionController.delete);

export default router;