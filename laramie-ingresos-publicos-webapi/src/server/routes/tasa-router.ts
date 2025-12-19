import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const tasaController = container.resolve('tasaController');
const router = express.Router();

router
    .get('/tasa', useAuth(), tasaController.get)
    .get('/tasa/filter', useAuth(), tasaController.getByFilter)
    .get('/tasa/:id', useAuth(), tasaController.getById)
    .post('/tasa', useAuth(), tasaController.post)
    .put('/tasa/:id', useAuth(), tasaController.put)
    .delete('/tasa/:id', useAuth(), tasaController.delete);

export default router;