import express from 'express';
import container from '../../infraestructure/ioc/dependency-injection';
import useAuth from '../middlewares/use-auth';

const rubroBCRAController = container.resolve('rubroBCRAController');
const router = express.Router();

router
    .get('/rubro-bcra', useAuth(), rubroBCRAController.get)
    .get('/rubro-bcra/:id', useAuth(), rubroBCRAController.getById)
    .post('/rubro-bcra', useAuth(), rubroBCRAController.post)
    .put('/rubro-bcra/:id', useAuth(), rubroBCRAController.put)
    .delete('/rubro-bcra/:id', useAuth(), rubroBCRAController.delete);

export default router;