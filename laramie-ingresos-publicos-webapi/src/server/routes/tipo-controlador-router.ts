import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const tipoControladorController = container.resolve('tipoControladorController');
const router = express.Router();

router
    .get('/tipo-controlador', useAuth(), tipoControladorController.get)
    .get('/tipo-controlador/:id', useAuth(), tipoControladorController.getById)
    .post('/tipo-controlador', useAuth(), tipoControladorController.post)
    .put('/tipo-controlador/:id', useAuth(), tipoControladorController.put)
    .delete('/tipo-controlador/:id', useAuth(), tipoControladorController.delete);

export default router;