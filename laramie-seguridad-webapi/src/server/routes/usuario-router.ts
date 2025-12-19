import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const usuarioController = container.resolve('usuarioController');
const router = express.Router();

router
    .get('/usuario', useAuth(), usuarioController.get)
    .get('/usuario/:id', useAuth(), usuarioController.getById)
    .get('/usuario/change-password/:login', usuarioController.getChangePassword)
    .post('/usuario', useAuth(), usuarioController.post)
    .put('/usuario/login', usuarioController.getByLogin) // (*)
    .put('/usuario/ids', useAuth(), usuarioController.putFindIds)
    .put('/usuario/:id', useAuth(), usuarioController.put)
    .put('/usuario/:id/perfiles/bind', useAuth(), usuarioController.putBindPerfiles)
    .put('/usuario/:id/perfiles/unbind', useAuth(), usuarioController.putUnindPerfiles)
    .put('/usuario/change-password/:token', usuarioController.putChangePassword)
    .delete('/usuario/:id', useAuth(), usuarioController.delete);
    // (*) Es un get pero se lo llama como put, para poder enviar usuario y contraseña dentro del Body de la request.

export default router;