import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const personaController = container.resolve('personaController');
const router = express.Router();

router
    .get('/persona/filter', useAuth, personaController.getByFilter)
    .get('/persona/:id', useAuth, personaController.getById);

export default router;