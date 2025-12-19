import express from 'express';
import container from '../../infraestructure/ioc/dependency-injection';
import useAuth from '../middlewares/use-auth';

const dependenciaController = container.resolve('dependenciaController');
const router = express.Router();

router
	.get('/dependencia', useAuth(), dependenciaController.get)
	.get('/dependencia/:id', useAuth(), dependenciaController.getById)
	.post('/dependencia', useAuth(['listas_tesoreria_edit']), dependenciaController.post)
	.put('/dependencia/:id', useAuth(['listas_tesoreria_edit']), dependenciaController.put)
	.delete('/dependencia/:id', useAuth(['listas_tesoreria_edit']), dependenciaController.delete)

export default router;