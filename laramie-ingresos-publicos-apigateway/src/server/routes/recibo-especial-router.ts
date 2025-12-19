import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const reciboEspecialController = container.resolve('reciboEspecialController');
const router = express.Router();

router
    .get('/recibo-especial', useAuth, reciboEspecialController.get)
    .get('/recibo-especial/:id', useAuth, reciboEspecialController.getById)
    .post('/recibo-especial', useAuth, reciboEspecialController.post)
    .put('/recibo-especial/:id', useAuth, reciboEspecialController.put)
    .delete('/recibo-especial/:id', useAuth, reciboEspecialController.delete);

export default router;
