import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const emisionDefinicionController = container.resolve('emisionDefinicionController');
const router = express.Router();

router
    .get('/emision-definicion', useAuth, emisionDefinicionController.get)
    .get('/emision-definicion/filter', useAuth, emisionDefinicionController.getByFilter)
    .get('/emision-definicion/:id', useAuth, emisionDefinicionController.getById)
    .post('/emision-definicion', useAuth, emisionDefinicionController.post)
    .put('/emision-definicion/:id', useAuth, emisionDefinicionController.put)
    .put('/emision-definicion/clone/:id', useAuth, emisionDefinicionController.cloneById)
    .delete('/emision-definicion/:id', useAuth, emisionDefinicionController.delete);

export default router;