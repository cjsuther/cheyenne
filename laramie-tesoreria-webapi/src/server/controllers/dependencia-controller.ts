import Dependencia from '../../domain/entities/dependencia';
import DependenciaService from '../../domain/services/dependencia-service';

export default class DependenciaController {

	dependenciaService: DependenciaService;

	constructor(dependenciaService: DependenciaService) {
		this.dependenciaService = dependenciaService;
	}

	get = async (req, res, next) => {
		this.dependenciaService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.dependenciaService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const dependencia = new Dependencia(); dependencia.setFromObject(dataBody);
		this.dependenciaService.add(dependencia)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const dependencia = new Dependencia(); dependencia.setFromObject(dataBody);
		this.dependenciaService.modify(id, dependencia)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.dependenciaService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
