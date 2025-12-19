import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const cuentaContableController = container.resolve('cuentaContableController');
const router = express.Router();

router
    .get('/cuenta-contable', useAuth(), cuentaContableController.get)
    .get('/cuenta-contable/:id', useAuth(), cuentaContableController.getById)
    .post('/cuenta-contable', useAuth(), cuentaContableController.post)
    .put('/cuenta-contable/:id', useAuth(), cuentaContableController.put)
    .delete('/cuenta-contable/:id', useAuth(), cuentaContableController.delete);

export default router;