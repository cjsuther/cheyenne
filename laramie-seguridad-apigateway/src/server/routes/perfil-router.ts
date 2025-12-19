import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const perfilController = container.resolve('perfilController');
const router = express.Router();

router
    .get('/perfil', useAuth, perfilController.get)
    .get('/perfil/usuario/:idUsuario', useAuth, perfilController.getByUsuario)
    .get('/perfil/:id', useAuth, perfilController.getById)
    .post('/perfil', useAuth, perfilController.post)
    .put('/perfil/:id', useAuth, perfilController.put)
    .put('/perfil/:id/permisos/bind', useAuth, perfilController.putBindPermisos)
    .put('/perfil/:id/permisos/unbind', useAuth, perfilController.putUnindPermisos)
    .delete('/perfil/:id', useAuth, perfilController.delete);

export default router;