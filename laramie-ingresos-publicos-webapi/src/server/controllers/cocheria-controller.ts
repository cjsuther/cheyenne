import Cocheria from '../../domain/entities/cocheria';
import CocheriaService from '../../domain/services/cocheria-service';

export default class CocheriaController {

	cocheriaService: CocheriaService;

	constructor(cocheriaService: CocheriaService) {
		this.cocheriaService = cocheriaService;
	}

	get = async (req, res, next) => {
		this.cocheriaService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.cocheriaService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const cocheria = new Cocheria(); cocheria.setFromObject(dataBody);
		this.cocheriaService.add(cocheria)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const cocheria = new Cocheria(); cocheria.setFromObject(dataBody);
		this.cocheriaService.modify(id, cocheria)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.cocheriaService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
