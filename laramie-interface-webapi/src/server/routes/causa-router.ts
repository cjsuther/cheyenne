import express from 'express';
import container from '../../infraestructure/ioc/dependency-injection';
import useAuth from '../middlewares/use-auth';

const causaController = container.resolve('causaController');
const router = express.Router();

router
    .get('/causa/vep/:idCuentaPago', useAuth(['causa_view']), causaController.get)
    .get('/causa/vep/detalle/:idCuentaPago', useAuth(['causa_view']), causaController.getDetalle)
    .put('/causa', useAuth(['causa_view']), causaController.put) //es un get pero se utiliza un put para enviar un objeto con filtros en el body
    .post('/causa', useAuth(['causa_edit']), causaController.post);

export default router;