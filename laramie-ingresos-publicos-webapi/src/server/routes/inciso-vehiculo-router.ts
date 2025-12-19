import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const incisoVehiculoController = container.resolve('incisoVehiculoController');
const router = express.Router();

router
    .get('/inciso-vehiculo', useAuth(), incisoVehiculoController.get)
    .get('/inciso-vehiculo/:id', useAuth(), incisoVehiculoController.getById)
    .post('/inciso-vehiculo', useAuth(), incisoVehiculoController.post)
    .put('/inciso-vehiculo/:id', useAuth(), incisoVehiculoController.put)
    .delete('/inciso-vehiculo/:id', useAuth(), incisoVehiculoController.delete);

export default router;