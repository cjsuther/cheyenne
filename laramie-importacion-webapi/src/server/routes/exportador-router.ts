import express from 'express';
import container from '../../infraestructure/ioc/dependency-injection';
import useAuth from '../middlewares/use-auth';

const exportadorController = container.resolve('exportadorController');
const router = express.Router();

router
    .put('/exportador/:tipo', useAuth(), exportadorController.put);

export default router;