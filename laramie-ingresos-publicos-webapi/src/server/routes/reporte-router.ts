import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const reporteController = container.resolve('reporteController');
const router = express.Router();

router
    .put('/reporte/:reporte', useAuth(), reporteController.put);

export default router;