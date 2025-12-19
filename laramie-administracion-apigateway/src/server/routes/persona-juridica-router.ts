import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const personaJuridicaController = container.resolve('personaJuridicaController');
const router = express.Router();

router
    .get('/persona-juridica', useAuth, personaJuridicaController.get)
    .get('/persona-juridica/filter', useAuth, personaJuridicaController.getByFilter)
    .get('/persona-juridica/:id', useAuth, personaJuridicaController.getById)
    .post('/persona-juridica', useAuth, personaJuridicaController.post)
    .put('/persona-juridica/:id', useAuth, personaJuridicaController.put)
    .delete('/persona-juridica/:id', useAuth, personaJuridicaController.delete);

export default router;