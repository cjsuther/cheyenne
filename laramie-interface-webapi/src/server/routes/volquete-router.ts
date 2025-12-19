import express from 'express';
import container from '../../infraestructure/ioc/dependency-injection';
import useAuth from '../middlewares/use-auth';

const volqueteController = container.resolve('volqueteController');
const router = express.Router();

router
    .get('/volquete/vep/:idCuentaPago', useAuth(['volquetes_view']), volqueteController.get)
    .get('/volquete/vep/detalle/:idCuentaPago', useAuth(['licencias_view']), volqueteController.getDetalle)
    .put('/volquete', useAuth(['volquetes_view']), volqueteController.put) //es un get pero se utiliza un put para enviar un objeto con filtros en el body
    .post('/volquete', useAuth(['volquetes_edit']), volqueteController.post);

export default router;