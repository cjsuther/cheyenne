import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const tipoVehiculoController = container.resolve('tipoVehiculoController');
const router = express.Router();

router
    .get('/tipo-vehiculo', useAuth(), tipoVehiculoController.get)
    .get('/tipo-vehiculo/:id', useAuth(), tipoVehiculoController.getById)
    .post('/tipo-vehiculo', useAuth(), tipoVehiculoController.post)
    .put('/tipo-vehiculo/:id', useAuth(), tipoVehiculoController.put)
    .delete('/tipo-vehiculo/:id', useAuth(), tipoVehiculoController.delete);

export default router;