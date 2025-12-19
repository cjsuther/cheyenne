import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const archivoController = container.resolve('archivoController');
const router = express.Router();

router
     .post('/archivo', useAuth(), archivoController.post)
     .delete('/archivo/:id', useAuth(), archivoController.delete);

export default router;