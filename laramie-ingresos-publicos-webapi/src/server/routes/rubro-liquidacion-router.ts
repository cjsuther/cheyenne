import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const rubroLiquidacionController = container.resolve('rubroLiquidacionController');
const router = express.Router();

router
    .get('/rubro-liquidacion', useAuth(), rubroLiquidacionController.get)
    .get('/rubro-liquidacion/:id', useAuth(), rubroLiquidacionController.getById)
    .post('/rubro-liquidacion', useAuth(), rubroLiquidacionController.post)
    .put('/rubro-liquidacion/:id', useAuth(), rubroLiquidacionController.put)
    .delete('/rubro-liquidacion/:id', useAuth(), rubroLiquidacionController.delete);

export default router;