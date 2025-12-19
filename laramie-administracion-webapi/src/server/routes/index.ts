import express from 'express';

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
import CuentaContableRouter from './cuenta-contable-router';
import JurisdiccionRouter from './jurisdiccion-router';
import RecursoPorRubroRouter from './recurso-por-rubro-router';

import PaisRouter from './pais-router';
import ProvinciaRouter from './provincia-router';
import LocalidadRouter from './localidad-router';
import ZonaGeoreferenciaRouter from './zona-georeferencia-router';
import TemaExpedienteRouter from './tema-expediente-router';

const router = express.Router();

const getRoutes = () => {
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
    router.use('/api', CuentaContableRouter);
    router.use('/api', JurisdiccionRouter);
    router.use('/api', RecursoPorRubroRouter);

    router.use('/api', PaisRouter);
    router.use('/api', ProvinciaRouter);
    router.use('/api', LocalidadRouter);
    router.use('/api', ZonaGeoreferenciaRouter);
    router.use('/api', TemaExpedienteRouter);
}

getRoutes();

export default router;