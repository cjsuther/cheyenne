import express from 'express';

import PagoRendicionRouter from './pago-rendicion-router';
import ReciboPublicacionRouter from './recibo-publicacion-router';

const router = express.Router();

const getRoutes = () => {
    router.use('/api', PagoRendicionRouter),
    router.use('/api', ReciboPublicacionRouter);
}

getRoutes();

export default router;