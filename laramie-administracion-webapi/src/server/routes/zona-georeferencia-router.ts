import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const zonaGeoreferenciaController = container.resolve('zonaGeoreferenciaController');
const router = express.Router();

router
    .get('/zona-georeferencia', useAuth(), zonaGeoreferenciaController.get)
    .get('/zona-georeferencia/:id', useAuth(), zonaGeoreferenciaController.getById)
    .post('/zona-georeferencia', useAuth(), zonaGeoreferenciaController.post)
    .put('/zona-georeferencia/:id', useAuth(), zonaGeoreferenciaController.put)
    .delete('/zona-georeferencia/:id', useAuth(), zonaGeoreferenciaController.delete);

export default router;