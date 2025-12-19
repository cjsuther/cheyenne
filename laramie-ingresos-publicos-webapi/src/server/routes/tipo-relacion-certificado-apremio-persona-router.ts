import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const tipoRelacionCertificadoApremioPersonaController = container.resolve('tipoRelacionCertificadoApremioPersonaController');
const router = express.Router();

router
    .get('/tipo-relacion-certificado-apremio-persona', useAuth(), tipoRelacionCertificadoApremioPersonaController.get)
    .get('/tipo-relacion-certificado-apremio-persona/:id', useAuth(), tipoRelacionCertificadoApremioPersonaController.getById)
    .post('/tipo-relacion-certificado-apremio-persona', useAuth(), tipoRelacionCertificadoApremioPersonaController.post)
    .put('/tipo-relacion-certificado-apremio-persona/:id', useAuth(), tipoRelacionCertificadoApremioPersonaController.put)
    .delete('/tipo-relacion-certificado-apremio-persona/:id', useAuth(), tipoRelacionCertificadoApremioPersonaController.delete);

export default router;