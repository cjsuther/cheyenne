import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const etiquetaController = container.resolve('etiquetaController');
const router = express.Router();

router
    .get('/etiqueta', useAuth, etiquetaController.get)
    .get('/etiqueta/entidad/:entidad/:idEntidad', useAuth, etiquetaController.getByEntidad)
    .get('/etiqueta/:id', useAuth, etiquetaController.getById)
    .post('/etiqueta', useAuth, etiquetaController.post)
    .delete('/etiqueta/:id', useAuth, etiquetaController.delete);

export default router;