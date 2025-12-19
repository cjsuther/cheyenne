import express from 'express';
import container from '../../infraestructure/ioc/dependency-injection';
import useAuth from '../middlewares/use-auth';

const permisoController = container.resolve('permisoController');
const router = express.Router();

router
    .get('/permiso', useAuth, permisoController.get)
    .get('/permiso/usuario', useAuth, permisoController.getByUsuario);

export default router;
