import express from 'express';

import AlertaRouter from './alerta-router';
import EventoRouter from './evento-router';
import IncidenciaRouter from './incidencia-router';

const router = express.Router();

const getRoutes = () => {
    router.use('/api', AlertaRouter);
    router.use('/api', EventoRouter);
    router.use('/api', IncidenciaRouter);
}

getRoutes();

export default router;
