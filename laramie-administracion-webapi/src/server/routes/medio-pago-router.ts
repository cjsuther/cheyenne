import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const medioPagoController = container.resolve('medioPagoController');
const router = express.Router();

router
    .get('/medio-pago', useAuth(), medioPagoController.get)
    .get('/medio-pago/persona/:idTipoPersona/:idPersona', useAuth(), medioPagoController.getByPersona)
    .get('/medio-pago/:id', useAuth(), medioPagoController.getById)
    .post('/medio-pago', useAuth(), medioPagoController.post)
    .put('/medio-pago/:id', useAuth(), medioPagoController.put)
    .delete('/medio-pago/:id', useAuth(), medioPagoController.delete);

export default router;