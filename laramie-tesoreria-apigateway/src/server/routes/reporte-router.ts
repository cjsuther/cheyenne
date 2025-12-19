import express from 'express';
import container from '../../infraestructure/ioc/dependency-injection';
import useAuth from '../middlewares/use-auth';

const reporteController = container.resolve('reporteController');
const router = express.Router();

router
    .put('/reporte/blob/:reporte', useAuth, reporteController.putBlob)
    .put('/reporte/json/:reporte', useAuth, reporteController.putJson);

export default router;