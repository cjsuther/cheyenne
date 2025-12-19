import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const vinculoComercioController = container.resolve('vinculoComercioController');
const router = express.Router();

router
    .get('/vinculo-comercio/:idComercio', useAuth(), vinculoComercioController.getByComercio)

export default router;