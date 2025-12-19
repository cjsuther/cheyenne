import express from 'express';
import container from '../../infraestructure/ioc/dependency-injection';
import useAuth from '../middlewares/use-auth';

const cuentaController = container.resolve('cuentaController');
const router = express.Router();

router
    .get('/cuenta/tipo-tributo/:idTipoTributo/numero-cuenta/:numeroCuenta/numero-web/:numeroWeb', useAuth, cuentaController.getByNumero)
    .get('/cuenta/contribuyente/:idPersona', useAuth, cuentaController.getByPersona)
    .get('/cuenta/comercio/:idComercio', useAuth, cuentaController.getByComercio)
    .get('/cuenta/retencion-alicuota', useAuth, cuentaController.getRetencionAlicuota)
    .get('/cuenta/retencion-alicuota/:idRetencionAlicuota', useAuth, cuentaController.getRetencionAlicuotaCSV);

export default router;