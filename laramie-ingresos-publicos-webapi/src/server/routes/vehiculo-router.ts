import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const vehiculoController = container.resolve('vehiculoController');
const router = express.Router();

router
    .get('/vehiculo/cuenta/filter', useAuth(), vehiculoController.getByCuenta)
    .get('/vehiculo/datos/filter', useAuth(), vehiculoController.getByDatos)
    .get('/vehiculo/:id', useAuth(), vehiculoController.getById)
    .post('/vehiculo', useAuth(), vehiculoController.post)
    .put('/vehiculo/:id', useAuth(), vehiculoController.put)
    .delete('/vehiculo/:id', useAuth(), vehiculoController.delete);

export default router;