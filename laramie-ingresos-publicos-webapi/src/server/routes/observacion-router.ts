import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const observacionController = container.resolve('observacionController');
const router = express.Router();

router
    .get('/observacion', useAuth(), observacionController.get)
    .get('/observacion/entidad/:entidad/:idEntidad', useAuth(), observacionController.getByEntidad)
    .get('/observacion/:id', useAuth(), observacionController.getById)
    .post('/observacion', useAuth(), observacionController.post)
    .put('/observacion/:id', useAuth(), observacionController.put)
    .delete('/observacion/:id', useAuth(), observacionController.delete);

export default router;