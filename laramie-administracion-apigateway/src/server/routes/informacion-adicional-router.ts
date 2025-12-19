import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const informacionAdicionalController = container.resolve('informacionAdicionalController');
const router = express.Router();

router
    .get('/informacion-adicional/entidad/:entidad/:idEntidad', useAuth, informacionAdicionalController.getByEntidad)
    .put('/informacion-adicional', useAuth, informacionAdicionalController.put);

export default router;