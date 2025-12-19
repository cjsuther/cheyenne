import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const contactoController = container.resolve('contactoController');
const router = express.Router();

router
    .get('/contacto', useAuth, contactoController.get)
    .get('/contacto/entidad/:entidad/:idEntidad', useAuth, contactoController.getByEntidad)
    .get('/contacto/:id', useAuth, contactoController.getById)
    .post('/contacto', useAuth, contactoController.post)
    .put('/contacto/:id', useAuth, contactoController.put)
    .delete('/contacto/:id', useAuth, contactoController.delete);

export default router;