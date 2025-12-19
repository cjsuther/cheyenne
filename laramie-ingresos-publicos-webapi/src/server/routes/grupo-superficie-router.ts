import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const grupoSuperficieController = container.resolve('grupoSuperficieController');
const router = express.Router();

router
    .get('/grupo-superficie', useAuth(), grupoSuperficieController.get)
    .get('/grupo-superficie/:id', useAuth(), grupoSuperficieController.getById)
    .post('/grupo-superficie', useAuth(), grupoSuperficieController.post)
    .put('/grupo-superficie/:id', useAuth(), grupoSuperficieController.put)
    .delete('/grupo-superficie/:id', useAuth(), grupoSuperficieController.delete);

export default router;