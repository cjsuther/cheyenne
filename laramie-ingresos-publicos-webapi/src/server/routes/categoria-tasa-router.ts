import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const categoriaTasaController = container.resolve('categoriaTasaController');
const router = express.Router();

router
    .get('/categoria-tasa', useAuth(), categoriaTasaController.get)
    .get('/categoria-tasa/:id', useAuth(), categoriaTasaController.getById)
    .post('/categoria-tasa', useAuth(), categoriaTasaController.post)
    .put('/categoria-tasa/:id', useAuth(), categoriaTasaController.put)
    .delete('/categoria-tasa/:id', useAuth(), categoriaTasaController.delete);

export default router;