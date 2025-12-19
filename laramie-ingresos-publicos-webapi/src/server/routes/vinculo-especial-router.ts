import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const vinculoEspecialController = container.resolve('vinculoEspecialController');
const router = express.Router();

router
    .get('/vinculo-especial/:idEspecial', useAuth(), vinculoEspecialController.getByEspecial)

export default router;