import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const zonaTarifariaController = container.resolve('zonaTarifariaController');
const router = express.Router();

router
    .get('/zona-tarifaria', useAuth(), zonaTarifariaController.get)
    .get('/zona-tarifaria/:id', useAuth(), zonaTarifariaController.getById)
    .post('/zona-tarifaria', useAuth(), zonaTarifariaController.post)
    .put('/zona-tarifaria/:id', useAuth(), zonaTarifariaController.put)
    .delete('/zona-tarifaria/:id', useAuth(), zonaTarifariaController.delete);

export default router;