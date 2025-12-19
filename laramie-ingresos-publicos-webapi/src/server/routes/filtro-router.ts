import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const filtroController = container.resolve('filtroController');
const router = express.Router();

router
    .get('/filtro', useAuth(), filtroController.get)
    .get('/filtro/:id', useAuth(), filtroController.getById)
    .post('/filtro', useAuth(), filtroController.post)
    .put('/filtro/:id', useAuth(), filtroController.put)
    .delete('/filtro/:id', useAuth(), filtroController.delete);

export default router;
