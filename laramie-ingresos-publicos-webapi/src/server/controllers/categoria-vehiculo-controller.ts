import CategoriaVehiculo from '../../domain/entities/categoria-vehiculo';
import CategoriaVehiculoService from '../../domain/services/categoria-vehiculo-service';

export default class CategoriaVehiculoController {

	categoriaVehiculoService: CategoriaVehiculoService;

	constructor(categoriaVehiculoService: CategoriaVehiculoService) {
		this.categoriaVehiculoService = categoriaVehiculoService;
	}

	get = async (req, res, next) => {
		this.categoriaVehiculoService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.categoriaVehiculoService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const categoriaVehiculo = new CategoriaVehiculo(); categoriaVehiculo.setFromObject(dataBody);
		this.categoriaVehiculoService.add(categoriaVehiculo)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const categoriaVehiculo = new CategoriaVehiculo(); categoriaVehiculo.setFromObject(dataBody);
		this.categoriaVehiculoService.modify(id, categoriaVehiculo)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.categoriaVehiculoService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
