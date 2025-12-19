import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const organoJudicialController = container.resolve('organoJudicialController');
const router = express.Router();

router
    .get('/organo-judicial', useAuth, organoJudicialController.get)
    .get('/organo-judicial/:id', useAuth, organoJudicialController.getById)
    .post('/organo-judicial', useAuth, organoJudicialController.post)
    .put('/organo-judicial/:id', useAuth, organoJudicialController.put)
    .delete('/organo-judicial/:id', useAuth, organoJudicialController.delete);

export default router;