import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const variableController = container.resolve('variableController');
const router = express.Router();

router
    .get('/variable', useAuth(), variableController.get)
    .get('/variable/:id', useAuth(), variableController.getById)
    .get('/variable/:codigo/cuenta/:idCuenta', useAuth(), variableController.getVariableCuentaByCodigo)
    .get('/variable/:codigo/global', useAuth(), variableController.getVariableGlobalByCodigo)
    .post('/variable', useAuth(), variableController.post)
    .put('/variable/:id', useAuth(), variableController.put)
    .delete('/variable/:id', useAuth(), variableController.delete);

export default router;