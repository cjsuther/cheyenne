import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const certificadoEscribanoController = container.resolve('certificadoEscribanoController');
const router = express.Router();

router
    .get('/certificado-escribano', useAuth, certificadoEscribanoController.get)
    .get('/certificado-escribano/filter', useAuth, certificadoEscribanoController.getByFilter)
    .get('/certificado-escribano/:id', useAuth, certificadoEscribanoController.getById)
    .post('/certificado-escribano', useAuth, certificadoEscribanoController.post)
    .put('/certificado-escribano/:id', useAuth, certificadoEscribanoController.put)
    .delete('/certificado-escribano/:id', useAuth, certificadoEscribanoController.delete);

export default router;