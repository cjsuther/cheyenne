import express from 'express';

import LoginRouter from './login-router';
import ListaRouter from './lista-router';
import VolqueteRouter from './volquete-router';
import ObraRouter from './obra-router';
import LicenciaRouter from './licencia-router';
import TasaRouter from './tasa-router';
import CausaRouter from './causa-router';
import BoletaRouter from './boleta-router';

const router = express.Router();

const getRoutes = () => {
    router.use('/api', BoletaRouter);
    router.use('/api', LoginRouter);
    router.use('/api', ListaRouter);
    router.use('/api', VolqueteRouter);
    router.use('/api', ObraRouter);
    router.use('/api', LicenciaRouter);
    router.use('/api', TasaRouter);
    router.use('/api', CausaRouter);
}

getRoutes();

export default router;