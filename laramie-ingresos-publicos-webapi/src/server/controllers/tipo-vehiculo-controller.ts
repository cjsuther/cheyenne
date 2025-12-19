import TipoVehiculo from '../../domain/entities/tipo-vehiculo';
import TipoVehiculoService from '../../domain/services/tipo-vehiculo-service';

export default class TipoVehiculoController {

	tipoVehiculoService: TipoVehiculoService;

	constructor(tipoVehiculoService: TipoVehiculoService) {
		this.tipoVehiculoService = tipoVehiculoService;
	}

	get = async (req, res, next) => {
		this.tipoVehiculoService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.tipoVehiculoService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const tipoVehiculo = new TipoVehiculo(); tipoVehiculo.setFromObject(dataBody);
		this.tipoVehiculoService.add(tipoVehiculo)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const tipoVehiculo = new TipoVehiculo(); tipoVehiculo.setFromObject(dataBody);
		this.tipoVehiculoService.modify(id, tipoVehiculo)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.tipoVehiculoService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
