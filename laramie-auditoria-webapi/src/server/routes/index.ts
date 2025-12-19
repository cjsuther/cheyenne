import express from 'express';

import ListaRouter from './lista-router';
import IncidenciaRouter from './incidencia-router';

const router = express.Router();

const getRoutes = () => {
    router.use('/api', ListaRouter);
    router.use('/api', IncidenciaRouter);
}

getRoutes();

export default router;