import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const archivoController = container.resolve('archivoController');
const router = express.Router();

router
    .get('/archivo', useAuth, archivoController.get)
    .get('/archivo/entidad/:entidad/:idEntidad', useAuth, archivoController.getByEntidad)
    .get('/archivo/:id', useAuth, archivoController.getById)
    .post('/archivo', useAuth, archivoController.post)
    .delete('/archivo/:id', useAuth, archivoController.delete);

export default router;