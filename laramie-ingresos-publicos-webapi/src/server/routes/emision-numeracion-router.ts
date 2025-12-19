import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const emisionNumeracionController = container.resolve('emisionNumeracionController');
const router = express.Router();

router
    .get('/emision-numeracion', useAuth(), emisionNumeracionController.get)
    .get('/emision-numeracion/:id', useAuth(), emisionNumeracionController.getById);

export default router;