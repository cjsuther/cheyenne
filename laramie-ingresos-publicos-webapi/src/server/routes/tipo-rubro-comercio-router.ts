import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const tipoRubroComercioController = container.resolve('tipoRubroComercioController');
const router = express.Router();

router
    .get('/tipo-rubro-comercio', useAuth(), tipoRubroComercioController.get)
    .get('/tipo-rubro-comercio/:id', useAuth(), tipoRubroComercioController.getById)
    .post('/tipo-rubro-comercio', useAuth(), tipoRubroComercioController.post)
    .put('/tipo-rubro-comercio/:id', useAuth(), tipoRubroComercioController.put)
    .delete('/tipo-rubro-comercio/:id', useAuth(), tipoRubroComercioController.delete);

export default router;