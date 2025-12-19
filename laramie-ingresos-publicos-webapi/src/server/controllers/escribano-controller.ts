import Escribano from '../../domain/entities/escribano';
import EscribanoService from '../../domain/services/escribano-service';

export default class EscribanoController {

	escribanoService: EscribanoService;

	constructor(escribanoService: EscribanoService) {
		this.escribanoService = escribanoService;
	}

	get = async (req, res, next) => {
		this.escribanoService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.escribanoService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const escribano = new Escribano(); escribano.setFromObject(dataBody);
		this.escribanoService.add(escribano)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const escribano = new Escribano(); escribano.setFromObject(dataBody);
		this.escribanoService.modify(id, escribano)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.escribanoService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
