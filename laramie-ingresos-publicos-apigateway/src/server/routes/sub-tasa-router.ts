import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const subTasaController = container.resolve('subTasaController');
const router = express.Router();

router
    .get('/sub-tasa', useAuth, subTasaController.get)
    .get('/sub-tasa/filter', useAuth, subTasaController.getByFilter)
    .get('/sub-tasa/:id', useAuth, subTasaController.getById)
    .post('/sub-tasa', useAuth, subTasaController.post)
    .put('/sub-tasa/:id', useAuth, subTasaController.put)
    .delete('/sub-tasa/:id', useAuth, subTasaController.delete);

export default router;