import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const declaracionJuradaComercioController = container.resolve('declaracionJuradaComercioController');
const router = express.Router();

router
    .get('/declaracion-jurada-comercio', useAuth, declaracionJuradaComercioController.get)
    .get('/declaracion-jurada-comercio/:id', useAuth, declaracionJuradaComercioController.getById)
    .get('/declaracion-jurada-comercio/cuenta/:idCuenta', useAuth, declaracionJuradaComercioController.getByCuenta)
    .post('/declaracion-jurada-comercio', useAuth, declaracionJuradaComercioController.post)
    .put('/declaracion-jurada-comercio/:id', useAuth, declaracionJuradaComercioController.put)
    .delete('/declaracion-jurada-comercio/:id', useAuth, declaracionJuradaComercioController.delete);

export default router;
