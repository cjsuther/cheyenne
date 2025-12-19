import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const ubicacionComercioController = container.resolve('ubicacionComercioController');
const router = express.Router();

router
    .get('/ubicacion-comercio', useAuth(), ubicacionComercioController.get)
    .get('/ubicacion-comercio/:id', useAuth(), ubicacionComercioController.getById)
    .post('/ubicacion-comercio', useAuth(), ubicacionComercioController.post)
    .put('/ubicacion-comercio/:id', useAuth(), ubicacionComercioController.put)
    .delete('/ubicacion-comercio/:id', useAuth(), ubicacionComercioController.delete);

export default router;