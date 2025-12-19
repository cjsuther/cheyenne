import express from 'express';
import container from '../../infraestructure/ioc/dependency-injection';
import useAuth from '../middlewares/use-auth';

const recaudadoraController = container.resolve('recaudadoraController');
const router = express.Router();

router
	.get('/recaudadora', useAuth(), recaudadoraController.get)
	.get('/recaudadora/:id', useAuth(), recaudadoraController.getById)
	.post('/recaudadora', useAuth(['listas_tesoreria_edit']), recaudadoraController.post)
	.put('/recaudadora/:id', useAuth(['listas_tesoreria_edit']), recaudadoraController.put)
	.delete('/recaudadora/:id', useAuth(['listas_tesoreria_edit']), recaudadoraController.delete)

export default router;