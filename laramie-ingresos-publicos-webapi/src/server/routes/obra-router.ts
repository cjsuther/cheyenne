import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const obraController = container.resolve('obraController');
const router = express.Router();

router
    .get('/obra', useAuth(), obraController.get)
    .get('/obra/:id', useAuth(), obraController.getById)
    .post('/obra', useAuth(), obraController.post)
    .put('/obra/:id', useAuth(), obraController.put)
    .delete('/obra/:id', useAuth(), obraController.delete);

export default router;