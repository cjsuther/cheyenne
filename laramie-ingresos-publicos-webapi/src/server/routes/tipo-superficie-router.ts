import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const tipoSuperficieController = container.resolve('tipoSuperficieController');
const router = express.Router();

router
    .get('/tipo-superficie', useAuth(), tipoSuperficieController.get)
    .get('/tipo-superficie/:id', useAuth(), tipoSuperficieController.getById)
    .post('/tipo-superficie', useAuth(), tipoSuperficieController.post)
    .put('/tipo-superficie/:id', useAuth(), tipoSuperficieController.put)
    .delete('/tipo-superficie/:id', useAuth(), tipoSuperficieController.delete);

export default router;