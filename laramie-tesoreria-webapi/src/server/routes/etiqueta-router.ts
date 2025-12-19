import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const etiquetaController = container.resolve('etiquetaController');
const router = express.Router();

router
     .post('/etiqueta', useAuth(), etiquetaController.post)
     .delete('/etiqueta/:id', useAuth(), etiquetaController.delete);

export default router;