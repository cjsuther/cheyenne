import express from 'express';

import FileRouter from './file-router';
import ReporteRouter from './reporte-router';
import ImportadorRouter from './importador-router';
import ListaRouter from './lista-router';
import EntidadRouter from './entidad-router';
import InformacionAdicionalRouter from './informacion-adicional-router';
import ArchivoRouter from './archivo-router';
import ObservacionRouter from './observacion-router';
import EtiquetaRouter from './etiqueta-router';
import PermisoRouter from './permiso-router';
import UsuarioRouter from './usuario-router';
import ReciboPublicacionLoteRouter from './recibo-publicacion-lote-router';
import CajaRouter from './caja-router';
import RecaudacionLoteRouter from './recaudacion-lote-router';
import RegistroContableLoteRouter from './registro-contable-lote-router';
import PagoRendicionLoteRouter from './pago-rendicion-lote-router';

const router = express.Router();

const getRoutes = () => {
    router.use('/api', FileRouter);
    router.use('/api', ReporteRouter);
    router.use('/api', ImportadorRouter);
    router.use('/api', ListaRouter);
    router.use('/api', EntidadRouter);
    router.use('/api', InformacionAdicionalRouter);
    router.use('/api', ArchivoRouter);
    router.use('/api', ObservacionRouter);
    router.use('/api', EtiquetaRouter);
    router.use('/api', PermisoRouter);
    router.use('/api', UsuarioRouter);
    router.use('/api', ReciboPublicacionLoteRouter);
    router.use('/api', CajaRouter);
    router.use('/api', RecaudacionLoteRouter);
    router.use('/api', RegistroContableLoteRouter);
    router.use('/api', PagoRendicionLoteRouter);
}

getRoutes();

export default router;