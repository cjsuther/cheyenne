import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const inmuebleController = container.resolve('inmuebleController');
const router = express.Router();

router
    .get('/inmueble/cuenta/filter', useAuth, inmuebleController.getByCuenta)
    .get('/inmueble/ubicacion/filter', useAuth, inmuebleController.getByUbicacion)
    .get('/inmueble/:id', useAuth, inmuebleController.getById)
    .post('/inmueble', useAuth, inmuebleController.post)
    .put('/inmueble/:id', useAuth, inmuebleController.put)
    .delete('/inmueble/:id', useAuth, inmuebleController.delete);

export default router;