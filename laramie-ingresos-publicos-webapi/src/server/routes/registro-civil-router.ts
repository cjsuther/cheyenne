import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const registroCivilController = container.resolve('registroCivilController');
const router = express.Router();

router
    .get('/registro-civil', useAuth(), registroCivilController.get)
    .get('/registro-civil/:id', useAuth(), registroCivilController.getById)
    .post('/registro-civil', useAuth(), registroCivilController.post)
    .put('/registro-civil/:id', useAuth(), registroCivilController.put)
    .delete('/registro-civil/:id', useAuth(), registroCivilController.delete);

export default router;