import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const documentoController = container.resolve('documentoController');
const router = express.Router();

router
    .get('/documento', useAuth, documentoController.get)
    .get('/documento/:id', useAuth, documentoController.getById)
    .post('/documento', useAuth, documentoController.post)
    .put('/documento/:id', useAuth, documentoController.put)
    .delete('/documento/:id', useAuth, documentoController.delete);

export default router;