import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const rubroController = container.resolve('rubroController');
const router = express.Router();

router
    .get('/rubro', useAuth(), rubroController.get)
    .get('/rubro/:id', useAuth(), rubroController.getById)
    .post('/rubro', useAuth(), rubroController.post)
    .put('/rubro/:id', useAuth(), rubroController.put)
    .delete('/rubro/:id', useAuth(), rubroController.delete);

export default router;