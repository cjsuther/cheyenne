import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const coleccionController = container.resolve('coleccionController');
const router = express.Router();

router
    .get('/coleccion/tipo-tributo/:idTipoTributo', useAuth, coleccionController.get)
    .get('/coleccion/:id', useAuth, coleccionController.getById);

export default router;
