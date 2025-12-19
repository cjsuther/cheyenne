import express from 'express';

import ListaRouter from './lista-router';
import UsuarioRouter from './usuario-router';
import PerfilRouter from './perfil-router';
import PermisoRouter from './permiso-router';
import AccesoRouter from './acceso-router';
import SesionRouter from './sesion-router';
import VerificacionRouter from './verificacion-router';

const router = express.Router();

const getRoutes = () => {
    router.use('/api', ListaRouter);
    router.use('/api', UsuarioRouter);
    router.use('/api', PerfilRouter);
    router.use('/api', PermisoRouter);
    router.use('/api', AccesoRouter);
    router.use('/api', SesionRouter);
    router.use('/api', VerificacionRouter);
}

getRoutes();

export default router;