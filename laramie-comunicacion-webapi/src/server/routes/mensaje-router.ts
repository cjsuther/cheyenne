import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const mensajeController = container.resolve('mensajeController');
const router = express.Router();

/* router
    .get('/mensaje', useAuth, mensajeController.get)
    .get('/mensaje/:id', useAuth, mensajeController.getById)
    .post('/mensaje', useAuth, mensajeController.post)
    .put('/mensaje/:id', useAuth, mensajeController.put)
    .delete('/mensaje/:id', useAuth, mensajeController.delete); */

export default router;
