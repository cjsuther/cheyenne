import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const grupoController = container.resolve('grupoController');
const router = express.Router();

router
    .get('/grupo', useAuth(), grupoController.get)
    .get('/grupo/:id', useAuth(), grupoController.getById)
    .post('/grupo', useAuth(), grupoController.post)
    .put('/grupo/:id', useAuth(), grupoController.put)
    .delete('/grupo/:id', useAuth(), grupoController.delete);

export default router;
