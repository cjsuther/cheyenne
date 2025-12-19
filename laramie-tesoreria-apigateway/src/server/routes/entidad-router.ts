import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const entidadController = container.resolve('entidadController');
const router = express.Router();

router
    .get('/entidad/definicion', useAuth, entidadController.getByDefinition)
    .get('/entidad/:tipos', useAuth, entidadController.getByTipos)
    .get('/entidad/:tipos/filter', useAuth, entidadController.getByTiposFilter)
    .get('/entidad/:tipo/:id', useAuth, entidadController.getById)
    .post('/entidad/:tipo/', useAuth, entidadController.post)
    .put('/entidad/:tipo/:id', useAuth, entidadController.put)
    .delete('/entidad/:tipo/:id', useAuth, entidadController.delete);

export default router;