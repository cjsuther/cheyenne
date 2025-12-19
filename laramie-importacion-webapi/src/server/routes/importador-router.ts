import express from 'express';
import container from '../../infraestructure/ioc/dependency-injection';
import useAuth from '../middlewares/use-auth';

const importadorController = container.resolve('importadorController');
const router = express.Router();

router
    .put('/importador/:tipo', useAuth(), importadorController.put);

export default router;