import express from 'express';
import container from '../../infraestructure/ioc/dependency-injection';
import useAuth from '../middlewares/use-auth';

const tasaController = container.resolve('tasaController');
const router = express.Router();

router
    .get('/tasa', useAuth(), tasaController.getTasa)
    .get('/tasa/sub-tasa', useAuth(), tasaController.getSubTasa)
    .put('/tasa/sub-tasa/imputacion', useAuth(), tasaController.getSubTasaImputacion); //es un get pero se utiliza un put para enviar un objeto con filtros en el body

export default router;