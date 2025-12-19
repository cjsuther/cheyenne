import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const certificadoApremioItemController = container.resolve('certificadoApremioItemController');
const router = express.Router();

router
    .get('/certificado-apremio-item/certificado-apremio/:idCertificadoApremio', useAuth, certificadoApremioItemController.getByCertificadoApremio);

export default router;