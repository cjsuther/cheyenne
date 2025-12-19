import IncisoVehiculo from '../../domain/entities/inciso-vehiculo';
import IncisoVehiculoService from '../../domain/services/inciso-vehiculo-service';

export default class IncisoVehiculoController {

	incisoVehiculoService: IncisoVehiculoService;

	constructor(incisoVehiculoService: IncisoVehiculoService) {
		this.incisoVehiculoService = incisoVehiculoService;
	}

	get = async (req, res, next) => {
		this.incisoVehiculoService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.incisoVehiculoService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const incisoVehiculo = new IncisoVehiculo(); incisoVehiculo.setFromObject(dataBody);
		this.incisoVehiculoService.add(incisoVehiculo)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const incisoVehiculo = new IncisoVehiculo(); incisoVehiculo.setFromObject(dataBody);
		this.incisoVehiculoService.modify(id, incisoVehiculo)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.incisoVehiculoService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
