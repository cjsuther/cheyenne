import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const claseElementoController = container.resolve('claseElementoController');
const router = express.Router();

router
    .get('/clase-elemento', useAuth(), claseElementoController.get)
    .get('/clase-elemento/:id', useAuth(), claseElementoController.getById);
    // .post('/clase-elemento', useAuth(), claseElementoController.post)
    // .put('/clase-elemento/:id', useAuth(), claseElementoController.put)
    // .delete('/clase-elemento/:id', useAuth(), claseElementoController.delete);

export default router;
