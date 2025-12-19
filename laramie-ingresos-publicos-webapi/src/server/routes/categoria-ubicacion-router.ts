import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const categoriaUbicacionController = container.resolve('categoriaUbicacionController');
const router = express.Router();

router
    .get('/categoria-ubicacion', useAuth(), categoriaUbicacionController.get)
    .get('/categoria-ubicacion/:id', useAuth(), categoriaUbicacionController.getById)
    .post('/categoria-ubicacion', useAuth(), categoriaUbicacionController.post)
    .put('/categoria-ubicacion/:id', useAuth(), categoriaUbicacionController.put)
    .delete('/categoria-ubicacion/:id', useAuth(), categoriaUbicacionController.delete);

export default router;