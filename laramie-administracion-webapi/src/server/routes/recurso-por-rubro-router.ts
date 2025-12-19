import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const recursoPorRubroController = container.resolve('recursoPorRubroController');
const router = express.Router();

router
    .get('/recurso-por-rubro', useAuth(), recursoPorRubroController.get)
    .get('/recurso-por-rubro/:id', useAuth(), recursoPorRubroController.getById)
    .post('/recurso-por-rubro', useAuth(), recursoPorRubroController.post)
    .put('/recurso-por-rubro/:id', useAuth(), recursoPorRubroController.put)
    .delete('/recurso-por-rubro/:id', useAuth(), recursoPorRubroController.delete);

export default router;