import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const vinculoInmuebleController = container.resolve('vinculoInmuebleController');
const router = express.Router();

router
    .get('/vinculo-inmueble/:idInmueble', useAuth(), vinculoInmuebleController.getByInmueble)

export default router;