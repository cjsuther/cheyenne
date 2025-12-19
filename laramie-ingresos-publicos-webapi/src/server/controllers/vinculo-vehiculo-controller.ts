import VinculoVehiculoService from '../../domain/services/vinculo-vehiculo-service';

export default class VinculoVehiculoController {

	vinculoVehiculoService: VinculoVehiculoService;

	constructor(vinculoVehiculoService: VinculoVehiculoService) {
		this.vinculoVehiculoService = vinculoVehiculoService;
	}

	getByVehiculo = (req, res, next) => {
		const idVehiculo = req.params.idVehiculo;
		this.vinculoVehiculoService.listByVehiculo(idVehiculo)
			.then(data => res.send(data))
			.catch(next)
	}

}
