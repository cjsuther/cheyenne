import express from 'express';
import container from '../../infraestructure/ioc/dependency-injection';
import useAuth from '../middlewares/use-auth';

const obraController = container.resolve('obraController');
const router = express.Router();

router
    .get('/obra/vep/:idCuentaPago', useAuth(['obras_view']), obraController.get)
    .get('/obra/vep/detalle/:idCuentaPago', useAuth(['obras_view']), obraController.getDetalle)
    .post('/obra/obra-carpeta', useAuth(['obras_edit']), obraController.postObraCarpeta)
    .post('/obra/obra-inicio', useAuth(['obras_edit']), obraController.postObraInicio);

export default router;