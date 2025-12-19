import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const comercioController = container.resolve('comercioController');
const router = express.Router();

router
    .get('/comercio/cuenta/filter', useAuth, comercioController.getByCuenta)
    .get('/comercio/datos/filter', useAuth, comercioController.getByDatos)
    .get('/comercio/:id', useAuth, comercioController.getById)
    .post('/comercio', useAuth, comercioController.post)
    .put('/comercio/:id', useAuth, comercioController.put)
    .delete('/comercio/:id', useAuth, comercioController.delete);

export default router;