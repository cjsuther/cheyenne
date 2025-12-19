import Incidencia from '../../domain/entities/incidencia';
import IncidenciaService from '../../domain/services/incidencia-service';

export default class IncidenciaController {

	incidenciaService: IncidenciaService;

	constructor(incidenciaService: IncidenciaService) {
		this.incidenciaService = incidenciaService;
	}

	get = async (req, res, next) => {
		this.incidenciaService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.incidenciaService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const incidencia = new Incidencia(); incidencia.setFromObject(dataBody);
		this.incidenciaService.add(incidencia)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const incidencia = new Incidencia(); incidencia.setFromObject(dataBody);
		this.incidenciaService.modify(id, incidencia)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.incidenciaService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
