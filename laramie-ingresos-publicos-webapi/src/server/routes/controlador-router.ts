import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const controladorController = container.resolve('controladorController');
const router = express.Router();

router
    .get('/controlador', useAuth(), controladorController.get)
    .get('/controlador/filter', useAuth(), controladorController.getByFilter)
    .get('/controlador/:id', useAuth(), controladorController.getById)
    .post('/controlador', useAuth(), controladorController.post)
    .put('/controlador/:id', useAuth(), controladorController.put)
    .delete('/controlador/:id', useAuth(), controladorController.delete);

export default router;