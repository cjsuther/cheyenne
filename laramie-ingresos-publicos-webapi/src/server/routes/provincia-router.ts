import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const provinciaController = container.resolve('provinciaController');
const router = express.Router();

router
    .get('/provincia', useAuth(), provinciaController.get)
    .get('/provincia/:id', useAuth(), provinciaController.getById)
    .post('/provincia', useAuth(), provinciaController.post)
    .put('/provincia/:id', useAuth(), provinciaController.put)
    .delete('/provincia/:id', useAuth(), provinciaController.delete);

export default router;