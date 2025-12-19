import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const observacionController = container.resolve('observacionController');
const router = express.Router();

router
     .post('/observacion', useAuth(), observacionController.post)
     .delete('/observacion/:id', useAuth(), observacionController.delete);

export default router;