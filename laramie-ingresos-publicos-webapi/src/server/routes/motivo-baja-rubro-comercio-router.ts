import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const motivoBajaRubroComercioController = container.resolve('motivoBajaRubroComercioController');
const router = express.Router();

router
    .get('/motivo-baja-rubro-comercio', useAuth(), motivoBajaRubroComercioController.get)
    .get('/motivo-baja-rubro-comercio/:id', useAuth(), motivoBajaRubroComercioController.getById)
    .post('/motivo-baja-rubro-comercio', useAuth(), motivoBajaRubroComercioController.post)
    .put('/motivo-baja-rubro-comercio/:id', useAuth(), motivoBajaRubroComercioController.put)
    .delete('/motivo-baja-rubro-comercio/:id', useAuth(), motivoBajaRubroComercioController.delete);

export default router;