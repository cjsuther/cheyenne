import Pais from '../../domain/entities/pais';
import PaisService from '../../domain/services/pais-service';

export default class PaisController {

	paisService: PaisService;

	constructor(paisService: PaisService) {
		this.paisService = paisService;
	}

	get = async (req, res, next) => {
		this.paisService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.paisService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const pais = new Pais(); pais.setFromObject(dataBody);
		this.paisService.add(pais)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const pais = new Pais(); pais.setFromObject(dataBody);
		this.paisService.modify(id, pais)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.paisService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
