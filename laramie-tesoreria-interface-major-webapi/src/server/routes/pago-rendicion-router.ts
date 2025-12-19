import express from 'express';
import container from '../../infraestructure/ioc/dependency-injection';
import useAuth from '../middlewares/use-auth';

const pagoRendicionController = container.resolve('pagoRendicionController');
const router = express.Router();

router
    .put('/pago-rendicion/import', useAuth(['cuenta-pago_edit']), pagoRendicionController.putImport)
    .put('/pago-rendicion/send', useAuth(['cuenta-pago_edit']), pagoRendicionController.putSend);

export default router;