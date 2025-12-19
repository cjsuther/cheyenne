import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const variableGlobalController = container.resolve('variableGlobalController');
const router = express.Router();

router
    .get('/variable-global', useAuth(), variableGlobalController.get)
    .get('/variable-global/:id', useAuth(), variableGlobalController.getById)
    .post('/variable-global', useAuth(), variableGlobalController.post)
    .put('/variable-global/:id', useAuth(), variableGlobalController.put)
    .delete('/variable-global/:id', useAuth(), variableGlobalController.delete);

export default router;
