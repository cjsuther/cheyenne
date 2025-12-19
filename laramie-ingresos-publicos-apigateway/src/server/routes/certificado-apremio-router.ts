import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const certificadoApremioController = container.resolve('certificadoApremioController');
const router = express.Router();

router
    .get('/certificado-apremio', useAuth, certificadoApremioController.get)
    .get('/certificado-apremio/filter', useAuth, certificadoApremioController.getByFilter)
    .get('/certificado-apremio/apremio/:idApremio', useAuth, certificadoApremioController.getByApremio)
    .get('/certificado-apremio/:id', useAuth, certificadoApremioController.getById)
    .post('/certificado-apremio', useAuth, certificadoApremioController.post)
    .put('/certificado-apremio/:id', useAuth, certificadoApremioController.put)
    .put('/certificado-apremio/cancel/:id', useAuth, certificadoApremioController.putCancel)
    .delete('/certificado-apremio/:id', useAuth, certificadoApremioController.delete);

export default router;