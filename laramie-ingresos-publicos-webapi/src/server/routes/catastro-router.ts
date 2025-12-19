import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const catastroController = container.resolve('catastroController');
const router = express.Router();

router
    .get('/catastro', useAuth(), catastroController.get)
    .get('/catastro/:id', useAuth(), catastroController.getById)
    .get('/catastro/partida/:partida', useAuth(), catastroController.getByPartida)
    .get('/catastro/nomenclatura/filters', useAuth(), catastroController.getByNomenclatura)
    .post('/catastro', useAuth(), catastroController.post)
    .put('/catastro/:id', useAuth(), catastroController.put)
    .delete('/catastro/:id', useAuth(), catastroController.delete);

export default router;