import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const paisController = container.resolve('paisController');
const router = express.Router();

router
    .get('/pais', useAuth(), paisController.get)
    .get('/pais/:id', useAuth(), paisController.getById)
    .post('/pais', useAuth(), paisController.post)
    .put('/pais/:id', useAuth(), paisController.put)
    .delete('/pais/:id', useAuth(), paisController.delete);

export default router;