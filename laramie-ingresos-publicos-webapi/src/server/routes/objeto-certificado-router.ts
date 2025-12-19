import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const objetoCertificadoController = container.resolve('objetoCertificadoController');
const router = express.Router();

router
    .get('/objeto-certificado', useAuth(), objetoCertificadoController.get)
    .get('/objeto-certificado/:id', useAuth(), objetoCertificadoController.getById)
    .post('/objeto-certificado', useAuth(), objetoCertificadoController.post)
    .put('/objeto-certificado/:id', useAuth(), objetoCertificadoController.put)
    .delete('/objeto-certificado/:id', useAuth(), objetoCertificadoController.delete);

export default router;