import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const eventoController = container.resolve('eventoController');
const router = express.Router();

router
    .get('/evento/filter', useAuth, eventoController.getByFilter)
    .get('/evento/back/:id', useAuth, eventoController.getByBackId)
    .get('/evento/forward/:id', useAuth, eventoController.getByForwardId)
    .get('/evento/:id', useAuth, eventoController.getById);

export default router;
