import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const permisoController = container.resolve('permisoController');
const router = express.Router();

router
    .get('/permiso', useAuth(), permisoController.get)
    .get('/permiso/perfil/:idPerfil', useAuth(), permisoController.getByPerfil)
    .get('/permiso/usuario/:idUsuario', useAuth(), permisoController.getByUsuario)
    .get('/permiso/:id', useAuth(), permisoController.getById)
    .put('/permiso/usuario', useAuth(), permisoController.putByUsuario); // (*)
    // (*) Es un get pero se lo llama como put, para poder enviar usuario y permiso dentro del Body de la request.

export default router;