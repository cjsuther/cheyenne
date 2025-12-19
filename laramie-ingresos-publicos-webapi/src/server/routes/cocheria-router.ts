import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const cocheriaController = container.resolve('cocheriaController');
const router = express.Router();

router
    .get('/cocheria', useAuth(), cocheriaController.get)
    .get('/cocheria/:id', useAuth(), cocheriaController.getById)
    .post('/cocheria', useAuth(), cocheriaController.post)
    .put('/cocheria/:id', useAuth(), cocheriaController.put)
    .delete('/cocheria/:id', useAuth(), cocheriaController.delete);

export default router;