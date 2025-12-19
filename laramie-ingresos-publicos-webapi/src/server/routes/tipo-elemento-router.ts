import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const tipoElementoController = container.resolve('tipoElementoController');
const router = express.Router();

router
    .get('/tipo-elemento', useAuth(), tipoElementoController.get)
    .get('/tipo-elemento/:id', useAuth(), tipoElementoController.getById)
    .get('/tipo-elemento/clase-elemento/:idClaseElemento', useAuth(), tipoElementoController.getByClaseElemento)
    .post('/tipo-elemento', useAuth(), tipoElementoController.post)
    .put('/tipo-elemento/:id', useAuth(), tipoElementoController.put)
    .delete('/tipo-elemento/:id', useAuth(), tipoElementoController.delete);

export default router;
