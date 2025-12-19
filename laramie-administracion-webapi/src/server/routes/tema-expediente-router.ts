import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const temaExpedienteController = container.resolve('temaExpedienteController');
const router = express.Router();

router
    .get('/tema-expediente', useAuth(), temaExpedienteController.get)
    .get('/tema-expediente/:id', useAuth(), temaExpedienteController.getById)
    .post('/tema-expediente', useAuth(), temaExpedienteController.post)
    .put('/tema-expediente/:id', useAuth(), temaExpedienteController.put)
    .delete('/tema-expediente/:id', useAuth(), temaExpedienteController.delete);

export default router;