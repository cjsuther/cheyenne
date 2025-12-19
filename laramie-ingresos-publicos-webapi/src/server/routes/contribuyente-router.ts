import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const contribuyenteController = container.resolve('contribuyenteController');
const router = express.Router();

router
    .get('/contribuyente', useAuth(), contribuyenteController.get)
    .get('/contribuyente/cuenta/:idCuenta', useAuth(), contribuyenteController.getByCuenta)
    .get('/contribuyente/:id', useAuth(), contribuyenteController.getById)
    .get('/contribuyente/persona/:idPersona', useAuth(), contribuyenteController.getByPersona)
    .post('/contribuyente', useAuth(), contribuyenteController.post)
    .put('/contribuyente/:id', useAuth(), contribuyenteController.put)
    .delete('/contribuyente/:id', useAuth(), contribuyenteController.delete);

export default router;