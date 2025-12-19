import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const vinculoCuentaController = container.resolve('vinculoCuentaController');
const router = express.Router();

router
    .get('/vinculo-cuenta/tributo/:idTipoTributo/:idTributo', useAuth(), vinculoCuentaController.getByTributo)

export default router;