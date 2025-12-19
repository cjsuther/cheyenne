import express from 'express';
import container from '../../infraestructure/ioc/dependency-injection';
import useAuth from '../middlewares/use-auth';

const licenciaController = container.resolve('licenciaController');
const router = express.Router();

router
    .get('/licencia/vep/:idCuentaPago', useAuth(['licencias_view']), licenciaController.get)
    .get('/licencia/vep/detalle/:idCuentaPago', useAuth(['licencias_view']), licenciaController.getDetalle)
    .post('/licencia', useAuth(['licencias_edit']), licenciaController.post);

export default router;