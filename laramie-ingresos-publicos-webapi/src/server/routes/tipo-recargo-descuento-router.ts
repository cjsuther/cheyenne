import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const tipoRecargoDescuentoController = container.resolve('tipoRecargoDescuentoController');
const router = express.Router();

router
    .get('/tipo-recargo-descuento', useAuth(), tipoRecargoDescuentoController.get)
    .get('/tipo-recargo-descuento/:id', useAuth(), tipoRecargoDescuentoController.getById)
    .post('/tipo-recargo-descuento', useAuth(), tipoRecargoDescuentoController.post)
    .put('/tipo-recargo-descuento/:id', useAuth(), tipoRecargoDescuentoController.put)
    .delete('/tipo-recargo-descuento/:id', useAuth(), tipoRecargoDescuentoController.delete);

export default router;