import UbicacionComercio from '../../domain/entities/ubicacion-comercio';
import UbicacionComercioService from '../../domain/services/ubicacion-comercio-service';

export default class UbicacionComercioController {

	ubicacionComercioService: UbicacionComercioService;

	constructor(ubicacionComercioService: UbicacionComercioService) {
		this.ubicacionComercioService = ubicacionComercioService;
	}

	get = async (req, res, next) => {
		this.ubicacionComercioService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.ubicacionComercioService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const ubicacionComercio = new UbicacionComercio(); ubicacionComercio.setFromObject(dataBody);
		this.ubicacionComercioService.add(ubicacionComercio)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const ubicacionComercio = new UbicacionComercio(); ubicacionComercio.setFromObject(dataBody);
		this.ubicacionComercioService.modify(id, ubicacionComercio)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.ubicacionComercioService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
