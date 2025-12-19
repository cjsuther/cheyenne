import express from 'express';

import ReporteRouter from './reporte-router';
import ListaRouter from './lista-router';
import EntidadRouter from './entidad-router';
import InformacionAdicionalRouter from './informacion-adicional-router';
import ArchivoRouter from './archivo-router';
import ObservacionRouter from './observacion-router';
import EtiquetaRouter from './etiqueta-router';

import ReciboPublicacionLoteRouter from './recibo-publicacion-lote-router';
import DependenciaRouter from './dependencia-router';
import CajaRouter from './caja-router';
import RecaudadoraRouter from './recaudadora-router';
import RecaudacionLoteRouter from './recaudacion-lote-router';
import PagoRendicionLoteRouter from './pago-rendicion-lote-router';
import RegistroContableLoteRouter from './registro-contable-lote-router';


const router = express.Router();

const getRoutes = () => {
    router.use('/api', ReporteRouter);
    router.use('/api', ListaRouter);
    router.use('/api', EntidadRouter);
    router.use('/api', InformacionAdicionalRouter);
    router.use('/api', ArchivoRouter);
    router.use('/api', ObservacionRouter);
    router.use('/api', EtiquetaRouter);

    router.use('/api', ReciboPublicacionLoteRouter);
    router.use('/api', DependenciaRouter);
    router.use('/api', CajaRouter);
    router.use('/api', RecaudadoraRouter);
    router.use('/api', RecaudacionLoteRouter);
    router.use('/api', PagoRendicionLoteRouter);
    router.use('/api', RegistroContableLoteRouter);
}

getRoutes();

export default router;