import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const rubroProvinciaController = container.resolve('rubroProvinciaController');
const router = express.Router();

router
    .get('/rubro-provincia', useAuth(), rubroProvinciaController.get)
    .get('/rubro-provincia/:id', useAuth(), rubroProvinciaController.getById)
    .post('/rubro-provincia', useAuth(), rubroProvinciaController.post)
    .put('/rubro-provincia/:id', useAuth(), rubroProvinciaController.put)
    .delete('/rubro-provincia/:id', useAuth(), rubroProvinciaController.delete);

export default router;