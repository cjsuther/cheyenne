import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const fondeaderoController = container.resolve('fondeaderoController');
const router = express.Router();

router
    .get('/fondeadero/cuenta/filter', useAuth, fondeaderoController.getByCuenta)
    .get('/fondeadero/datos/filter', useAuth, fondeaderoController.getByDatos)
    .get('/fondeadero/:id', useAuth, fondeaderoController.getById)
    .post('/fondeadero', useAuth, fondeaderoController.post)
    .put('/fondeadero/:id', useAuth, fondeaderoController.put)
    .delete('/fondeadero/:id', useAuth, fondeaderoController.delete);

export default router;