import express from 'express';

import FileRouter from './file-router';
import ListaRouter from './lista-router';
import EntidadRouter from './entidad-router';
import ContactoRouter from './contacto-router';
import DireccionRouter from './direccion-router';
import DocumentoRouter from './documento-router';
import InformacionAdicionalRouter from './informacion-adicional-router';
import ArchivoRouter from './archivo-router';
import ObservacionRouter from './observacion-router';
import EtiquetaRouter from './etiqueta-router';
import ExpedienteRouter from './expediente-router';
import PersonaFisicaRouter from './persona-fisica-router';
import PersonaJuridicaRouter from './persona-juridica-router';
import MedioPagoRouter from './medio-pago-router';
import PermisoRouter from './permiso-router';

const router = express.Router();

const getRoutes = () => {
    router.use('/api', FileRouter);
    router.use('/api', ListaRouter);
    router.use('/api', EntidadRouter);
    router.use('/api', ContactoRouter);
    router.use('/api', DireccionRouter);
    router.use('/api', DocumentoRouter);
    router.use('/api', InformacionAdicionalRouter);
    router.use('/api', ArchivoRouter);
    router.use('/api', ObservacionRouter);
    router.use('/api', EtiquetaRouter);
    router.use('/api', ExpedienteRouter);
    router.use('/api', PersonaFisicaRouter);
    router.use('/api', PersonaJuridicaRouter);
    router.use('/api', MedioPagoRouter);
    router.use('/api', PermisoRouter);
}

getRoutes();

export default router;