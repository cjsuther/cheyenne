import Localidad from '../../domain/entities/localidad';
import LocalidadService from '../../domain/services/localidad-service';

export default class LocalidadController {

	localidadService: LocalidadService;

	constructor(localidadService: LocalidadService) {
		this.localidadService = localidadService;
	}

	get = async (req, res, next) => {
		this.localidadService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.localidadService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const localidad = new Localidad(); localidad.setFromObject(dataBody);
		this.localidadService.add(localidad)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const localidad = new Localidad(); localidad.setFromObject(dataBody);
		this.localidadService.modify(id, localidad)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.localidadService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
