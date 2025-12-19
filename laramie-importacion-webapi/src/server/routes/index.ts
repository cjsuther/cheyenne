import express from 'express';

import ImportadorRouter from './importador-router';
import ExportadorRouter from './exportador-router';

const router = express.Router();

const getRoutes = () => {
    router.use('/api', ImportadorRouter);
    router.use('/api', ExportadorRouter);
}

getRoutes();

export default router;