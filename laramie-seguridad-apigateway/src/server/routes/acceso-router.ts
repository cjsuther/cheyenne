import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const accesoController = container.resolve('accesoController');
const router = express.Router();

router
    .get('/acceso', useAuth, accesoController.get)
    .get('/acceso/:id', useAuth, accesoController.getById)
    .get('/acceso', useAuth, accesoController.getAccessByUser)
    .post('/acceso', useAuth, accesoController.post)
    .put('/acceso/:id', useAuth, accesoController.put)
    .delete('/acceso/:id', useAuth, accesoController.delete);

export default router;