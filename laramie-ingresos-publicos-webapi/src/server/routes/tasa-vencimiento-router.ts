import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const tasaVencimientoController = container.resolve('tasaVencimientoController');
const router = express.Router();

router
    .get('/tasa-vencimiento', useAuth(), tasaVencimientoController.get)
    .get('/tasa-vencimiento/:id', useAuth(), tasaVencimientoController.getById)
    .post('/tasa-vencimiento', useAuth(), tasaVencimientoController.post)
    .put('/tasa-vencimiento/:id', useAuth(), tasaVencimientoController.put)
    .delete('/tasa-vencimiento/:id', useAuth(), tasaVencimientoController.delete);

export default router;