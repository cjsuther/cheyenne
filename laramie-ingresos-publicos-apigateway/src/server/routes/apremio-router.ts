import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const apremioController = container.resolve('apremioController');
const router = express.Router();

router
    .get('/apremio', useAuth, apremioController.get)
    .get('/apremio/filter', useAuth, apremioController.getByFilter)
    .get('/apremio/:id', useAuth, apremioController.getById)
    .post('/apremio/:idCertificadoApremio', useAuth, apremioController.post)
    .put('/apremio/:id', useAuth, apremioController.put)
    .delete('/apremio/:id', useAuth, apremioController.delete);

export default router;