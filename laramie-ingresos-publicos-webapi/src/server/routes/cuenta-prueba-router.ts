import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const cuentaPruebaController = container.resolve('cuentaPruebaController');
const router = express.Router();

router
    .get('/cuenta-prueba', useAuth(), cuentaPruebaController.get)
    .get('/cuenta-prueba/:id', useAuth(), cuentaPruebaController.getById)
    .post('/cuenta-prueba', useAuth(), cuentaPruebaController.post)
    .put('/cuenta-prueba/:id', useAuth(), cuentaPruebaController.put)
    .delete('/cuenta-prueba/:id', useAuth(), cuentaPruebaController.delete);

export default router;
