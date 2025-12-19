import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const especialController = container.resolve('especialController');
const router = express.Router();

router
    .get('/cuenta-especial/cuenta/filter', useAuth, especialController.getByCuenta)
    .get('/cuenta-especial/:id', useAuth, especialController.getById)
    .post('/cuenta-especial', useAuth, especialController.post)
    .put('/cuenta-especial/:id', useAuth, especialController.put)
    .delete('/cuenta-especial/:id', useAuth, especialController.delete);

export default router;