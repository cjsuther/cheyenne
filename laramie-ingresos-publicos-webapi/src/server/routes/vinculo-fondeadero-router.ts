import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const vinculoFondeaderoController = container.resolve('vinculoFondeaderoController');
const router = express.Router();

router
    .get('/vinculo-fondeadero/:idFondeadero', useAuth(), vinculoFondeaderoController.getByFondeadero)

export default router;