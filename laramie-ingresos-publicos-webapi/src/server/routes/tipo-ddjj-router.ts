import express from 'express';
import container from '../../infraestructure/ioc/dependency-injection';
import useAuth from '../middlewares/use-auth';

const tipoDDJJController = container.resolve('tipoDDJJController');
const router = express.Router();

router
    .get('/tipo-ddjj', useAuth(), tipoDDJJController.get)
    .get('/tipo-ddjj/:id', useAuth(), tipoDDJJController.getById)
    .post('/tipo-ddjj', useAuth(), tipoDDJJController.post)
    .put('/tipo-ddjj/:id', useAuth(), tipoDDJJController.put)
    .delete('/tipo-ddjj/:id', useAuth(), tipoDDJJController.delete);

export default router;