import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const direccionController = container.resolve('direccionController');
const router = express.Router();

router
    .get('/direccion', useAuth(), direccionController.get)
    // se quita temporalmente para que ing brutos lo consuma sin token
    //.get('/direccion/entidad/:entidad/:idEntidad', useAuth(), direccionController.getByEntidad)
    .get('/direccion/entidad/:entidad/:idEntidad', direccionController.getByEntidad)
    .get('/direccion/:id', useAuth(), direccionController.getById)
    .post('/direccion', useAuth(), direccionController.post)
    .put('/direccion/:id', useAuth(), direccionController.put)
    .delete('/direccion/:id', useAuth(), direccionController.delete);

export default router;