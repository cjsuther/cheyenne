import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const tipoVinculoCuentaController = container.resolve('tipoVinculoCuentaController');
const router = express.Router();

router
    .get('/tipo-vinculo-cuenta', useAuth(), tipoVinculoCuentaController.get)
    .get('/tipo-vinculo-cuenta/tipo-tributo/:idTipoTributo', useAuth(), tipoVinculoCuentaController.getByTipoTributo)

export default router;