import express from 'express';
import container from '../../infraestructure/ioc/dependency-injection';
import useAuth from '../middlewares/use-auth';

const reciboPublicacionController = container.resolve('reciboPublicacionController');
const router = express.Router();

router
    .put('/recibo-publicacion/export/:modo', useAuth(['cuenta-pago_edit']), reciboPublicacionController.putExport)
    .put('/recibo-publicacion/confirmacion/:numeroLotePublicacion', useAuth(['cuenta-pago_edit']), reciboPublicacionController.putConfirmacion);

export default router;