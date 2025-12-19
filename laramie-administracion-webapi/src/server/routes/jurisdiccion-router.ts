import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const jurisdiccionController = container.resolve('jurisdiccionController');
const router = express.Router();

router
    .get('/jurisdiccion', useAuth(), jurisdiccionController.get)
    .get('/jurisdiccion/:id', useAuth(), jurisdiccionController.getById)
    .post('/jurisdiccion', useAuth(), jurisdiccionController.post)
    .put('/jurisdiccion/:id', useAuth(), jurisdiccionController.put)
    .delete('/jurisdiccion/:id', useAuth(), jurisdiccionController.delete);

export default router;