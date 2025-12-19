import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const categoriaVehiculoController = container.resolve('categoriaVehiculoController');
const router = express.Router();

router
    .get('/categoria-vehiculo', useAuth(), categoriaVehiculoController.get)
    .get('/categoria-vehiculo/:id', useAuth(), categoriaVehiculoController.getById)
    .post('/categoria-vehiculo', useAuth(), categoriaVehiculoController.post)
    .put('/categoria-vehiculo/:id', useAuth(), categoriaVehiculoController.put)
    .delete('/categoria-vehiculo/:id', useAuth(), categoriaVehiculoController.delete);

export default router;