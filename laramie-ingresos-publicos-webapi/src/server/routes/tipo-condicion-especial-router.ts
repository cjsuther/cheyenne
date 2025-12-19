import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const tipoCondicionEspecialController = container.resolve('tipoCondicionEspecialController');
const router = express.Router();

router
    .get('/tipo-condicion-especial', useAuth(), tipoCondicionEspecialController.get)
    .get('/tipo-condicion-especial/:id', useAuth(), tipoCondicionEspecialController.getById)
    .post('/tipo-condicion-especial', useAuth(), tipoCondicionEspecialController.post)
    .put('/tipo-condicion-especial/:id', useAuth(), tipoCondicionEspecialController.put)
    .delete('/tipo-condicion-especial/:id', useAuth(), tipoCondicionEspecialController.delete);

export default router;