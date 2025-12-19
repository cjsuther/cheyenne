import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const personaFisicaController = container.resolve('personaFisicaController');
const router = express.Router();

router
    .get('/persona-fisica', useAuth(), personaFisicaController.get)
    .get('/persona-fisica/filter', useAuth(), personaFisicaController.getByFilter)
    .get('/persona-fisica/:id', useAuth(), personaFisicaController.getById)
    .post('/persona-fisica', useAuth(), personaFisicaController.post)
    .put('/persona-fisica/:id', useAuth(), personaFisicaController.put)
    .delete('/persona-fisica/:id', useAuth(), personaFisicaController.delete);

export default router;