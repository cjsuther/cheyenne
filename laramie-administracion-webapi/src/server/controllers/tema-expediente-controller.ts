import TemaExpediente from '../../domain/entities/tema-expediente';
import TemaExpedienteService from '../../domain/services/tema-expediente-service';

export default class TemaExpedienteController {

	temaExpedienteService: TemaExpedienteService;

	constructor(temaExpedienteService: TemaExpedienteService) {
		this.temaExpedienteService = temaExpedienteService;
	}

	get = async (req, res, next) => {
		this.temaExpedienteService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.temaExpedienteService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const temaExpediente = new TemaExpediente(); temaExpediente.setFromObject(dataBody);
		this.temaExpedienteService.add(temaExpediente)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const temaExpediente = new TemaExpediente(); temaExpediente.setFromObject(dataBody);
		this.temaExpedienteService.modify(id, temaExpediente)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.temaExpedienteService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
