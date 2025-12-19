import express from 'express';

import MensajeRouter from './mensaje-router';
import ListaRouter from './lista-router';

const router = express.Router();

const getRoutes = () => {
    router.use('/api', MensajeRouter);
    router.use('/api', ListaRouter);
}

getRoutes();

export default router;