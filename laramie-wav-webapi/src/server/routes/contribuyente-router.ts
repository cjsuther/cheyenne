import express from 'express';
import container from '../../infraestructure/ioc/dependency-injection';
import useAuth from '../middlewares/use-auth';

const contribuyenteController = container.resolve('contribuyenteController');
const router = express.Router();

router
    .get('/contribuyente/tipo-documento/:idTipoDocumento/numero-documento/:numeroDocumento', useAuth, contribuyenteController.getByDocumento)
    .get('/contribuyente/:idPersona', useAuth, contribuyenteController.getById)
    .post('/contribuyente', useAuth, contribuyenteController.post)

    .put('/contribuyente/:idPersona/cuenta/:idCuenta/vincular', useAuth, contribuyenteController.putBindContribuyente)
    .put('/contribuyente/:idPersona/cuenta/:idCuenta/desvincular', useAuth, contribuyenteController.putUnbindContribuyente)
    .get('/contribuyente/:idPersona/cuenta/:idCuenta/deuda', useAuth, contribuyenteController.getByDeudaVencimiento)
    .get('/contribuyente/:idPersona/cuenta/:idCuenta/credito', useAuth, contribuyenteController.getByCredito)

    .put('/contribuyente/:idPersona/cuenta/:idCuenta/plan-pago/definicion', useAuth, contribuyenteController.getPlanPagoDefiniciones)
    .put('/contribuyente/:idPersona/cuenta/:idCuenta/plan-pago/definicion/:idPlanPagoDefinicion', useAuth, contribuyenteController.getPlanPagoDefinicionDetalle)
    .put('/contribuyente/:idPersona/cuenta/:idCuenta/plan-pago/convenio-preview/:idPlanPagoDefinicion', useAuth, contribuyenteController.getPlanPagoConvenioPreview)
    .post('/contribuyente/:idPersona/cuenta/:idCuenta/plan-pago/generar/:idPlanPagoDefinicion', useAuth, contribuyenteController.postPlanPago)
    .get('/contribuyente/:idPersona/cuenta/:idCuenta/plan-pago/detalle/:idPlanPago', useAuth, contribuyenteController.getPlanPagoDetalle)
    .get('/contribuyente/:idPersona/cuenta/:idCuenta/plan-pago/recibo/:idPlanPago', useAuth, contribuyenteController.getPlanPagoRecibo)
    .get('/contribuyente/:idPersona/cuenta/:idCuenta/plan-pago/convenio/:idPlanPago', useAuth, contribuyenteController.getPlanPagoConvenio)

    .put('/contribuyente/:idPersona/cuenta/:idCuenta/pago-contado/definicion', useAuth, contribuyenteController.getPagoContadoDefiniciones)
    .put('/contribuyente/:idPersona/cuenta/:idCuenta/pago-contado/definicion/:idPagoContadoDefinicion', useAuth, contribuyenteController.getPagoContadoDefinicionDetalle)
    .post('/contribuyente/:idPersona/cuenta/:idCuenta/pago-contado/generar/:idPagoContadoDefinicion', useAuth, contribuyenteController.postPagoContado)
    .get('/contribuyente/:idPersona/cuenta/:idCuenta/pago-contado/recibo/:idCuentaPago', useAuth, contribuyenteController.getPagoContadoRecibo)

    .post('/contribuyente/:idPersona/cuenta/:idCuenta/recibo-comun/generar', useAuth, contribuyenteController.postReciboComun)
    .get('/contribuyente/:idPersona/cuenta/:idCuenta/recibo-comun/recibo/:idCuentaPago', useAuth, contribuyenteController.getReciboComunRecibo)

    .get('/contribuyente/:idPersona/cuenta/:idCuenta/recibo/detalle/:idCuentaPago', useAuth, contribuyenteController.getReciboDetalle)
    
    .get('/contribuyente/:idPersona/cuenta/:idCuenta/declaracion-jurada/definicion', useAuth, contribuyenteController.getDeclaracionJuradaDefiniciones)
    .get('/contribuyente/:idPersona/cuenta/:idCuenta/declaracion-jurada/definicion/:idModeloDeclaracionJurada', useAuth, contribuyenteController.getDeclaracionJuradaDefinicionDetalle)
    .get('/contribuyente/:idPersona/cuenta/:idCuenta/declaracion-jurada/presentacion', useAuth, contribuyenteController.getDeclaracionJuradaPresentadas)
    .get('/contribuyente/:idPersona/cuenta/:idCuenta/declaracion-jurada/presentacion/:idDeclaracionJurada', useAuth, contribuyenteController.getDeclaracionJuradaPresentadaDetalle)
    .post('/contribuyente/:idPersona/cuenta/:idCuenta/declaracion-jurada/generar/:idModeloDeclaracionJurada', useAuth, contribuyenteController.postDeclaracionJurada)
    .post('/contribuyente/:idPersona/cuenta/:idCuenta/declaracion-jurada/preview/:idModeloDeclaracionJurada', useAuth, contribuyenteController.postDeclaracionJuradaPreview)
    .post('/contribuyente/:idPersona/cuenta/:idCuenta/retencion/generar', useAuth, contribuyenteController.postRetencion);


export default router;