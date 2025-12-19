import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const convenioParametroController = container.resolve('convenioParametroController');
const router = express.Router();

router
    .get('/convenio-parametro', useAuth, convenioParametroController.get)
    /* .get('/convenio-parametro/:id', useAuth, convenioParametroController.getById)
    .post('/convenio-parametro', useAuth, convenioParametroController.post)
    .put('/convenio-parametro/:id', useAuth, convenioParametroController.put)
    .delete('/convenio-parametro/:id', useAuth, convenioParametroController.delete); */

export default router;
