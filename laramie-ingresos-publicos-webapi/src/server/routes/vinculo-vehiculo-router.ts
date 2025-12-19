import express from 'express';
import container from './../../infraestructure/ioc/dependency-injection';
import useAuth from './../middlewares/use-auth';

const vinculoVehiculoController = container.resolve('vinculoVehiculoController');
const router = express.Router();

router
    .get('/vinculo-vehiculo/:idVehiculo', useAuth(), vinculoVehiculoController.getByVehiculo)

export default router;