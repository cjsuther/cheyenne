import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const cementerioController = container.resolve('cementerioController');
const router = express.Router();

router
    .get('/cementerio/cuenta/filter', useAuth(), cementerioController.getByCuenta)
    .get('/cementerio/datos/filter', useAuth(), cementerioController.getByDatos)
    .get('/cementerio/:id', useAuth(), cementerioController.getById)
    .post('/cementerio', useAuth(), cementerioController.post)
    .put('/cementerio/:id', useAuth(), cementerioController.put)
    .delete('/cementerio/:id', useAuth(), cementerioController.delete);

export default router;