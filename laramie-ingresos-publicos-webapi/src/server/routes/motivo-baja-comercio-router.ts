import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const motivoBajaComercioController = container.resolve('motivoBajaComercioController');
const router = express.Router();

router
    .get('/motivo-baja-comercio', useAuth(), motivoBajaComercioController.get)
    .get('/motivo-baja-comercio/:id', useAuth(), motivoBajaComercioController.getById)
    .post('/motivo-baja-comercio', useAuth(), motivoBajaComercioController.post)
    .put('/motivo-baja-comercio/:id', useAuth(), motivoBajaComercioController.put)
    .delete('/motivo-baja-comercio/:id', useAuth(), motivoBajaComercioController.delete);

export default router;