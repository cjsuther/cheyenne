import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const cuotaPorcentajeController = container.resolve('cuotaPorcentajeController');
const router = express.Router();

router
    .get('/cuota-porcentaje', useAuth, cuotaPorcentajeController.get)
    .get('/cuota-porcentaje/:id', useAuth, cuotaPorcentajeController.getById)
    .post('/cuota-porcentaje', useAuth, cuotaPorcentajeController.post)
    .put('/cuota-porcentaje/:id', useAuth, cuotaPorcentajeController.put)
    .delete('/cuota-porcentaje/:id', useAuth, cuotaPorcentajeController.delete);

export default router;