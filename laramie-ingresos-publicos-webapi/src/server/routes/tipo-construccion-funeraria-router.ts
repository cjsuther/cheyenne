import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const tipoConstruccionFunerariaController = container.resolve('tipoConstruccionFunerariaController');
const router = express.Router();

router
    .get('/tipo-construccion-funeraria', useAuth(), tipoConstruccionFunerariaController.get)
    .get('/tipo-construccion-funeraria/:id', useAuth(), tipoConstruccionFunerariaController.getById)
    .post('/tipo-construccion-funeraria', useAuth(), tipoConstruccionFunerariaController.post)
    .put('/tipo-construccion-funeraria/:id', useAuth(), tipoConstruccionFunerariaController.put)
    .delete('/tipo-construccion-funeraria/:id', useAuth(), tipoConstruccionFunerariaController.delete);

export default router;