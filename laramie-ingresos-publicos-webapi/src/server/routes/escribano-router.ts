import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const escribanoController = container.resolve('escribanoController');
const router = express.Router();

router
    .get('/escribano', useAuth(), escribanoController.get)
    .get('/escribano/:id', useAuth(), escribanoController.getById)
    .post('/escribano', useAuth(), escribanoController.post)
    .put('/escribano/:id', useAuth(), escribanoController.put)
    .delete('/escribano/:id', useAuth(), escribanoController.delete);

export default router;