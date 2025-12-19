import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const vinculoCementerioController = container.resolve('vinculoCementerioController');
const router = express.Router();

router
    .get('/vinculo-cementerio/:idCementerio', useAuth(), vinculoCementerioController.getByCementerio)

export default router;