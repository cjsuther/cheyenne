import Provincia from '../../domain/entities/provincia';
import ProvinciaService from '../../domain/services/provincia-service';

export default class ProvinciaController {

	provinciaService: ProvinciaService;

	constructor(provinciaService: ProvinciaService) {
		this.provinciaService = provinciaService;
	}

	get = async (req, res, next) => {
		this.provinciaService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.provinciaService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const provincia = new Provincia(); provincia.setFromObject(dataBody);
		this.provinciaService.add(provincia)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const provincia = new Provincia(); provincia.setFromObject(dataBody);
		this.provinciaService.modify(id, provincia)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.provinciaService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
