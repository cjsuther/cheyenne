import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const incidenciaController = container.resolve('incidenciaController');
const router = express.Router();

router
    .get('/incidencia', useAuth, incidenciaController.get)
    .get('/incidencia/:id', useAuth, incidenciaController.getById)
    .post('/incidencia', useAuth, incidenciaController.post)
    .put('/incidencia/:id', useAuth, incidenciaController.put)
    .delete('/incidencia/:id', useAuth, incidenciaController.delete);

export default router;
