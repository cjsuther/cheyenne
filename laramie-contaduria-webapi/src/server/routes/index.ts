import express from 'express';

import ListaRouter from './lista-router';

const router = express.Router();

const getRoutes = () => {
    router.use('/api', ListaRouter);
}

getRoutes();

export default router;