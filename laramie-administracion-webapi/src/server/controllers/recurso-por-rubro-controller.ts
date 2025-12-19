import RecursoPorRubro from '../../domain/entities/recurso-por-rubro';
import RecursoPorRubroService from '../../domain/services/recurso-por-rubro-service';

export default class RecursoPorRubroController {

	recursoPorRubroService: RecursoPorRubroService;

	constructor(recursoPorRubroService: RecursoPorRubroService) {
		this.recursoPorRubroService = recursoPorRubroService;
	}

	get = async (req, res, next) => {
		this.recursoPorRubroService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.recursoPorRubroService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const recursoPorRubro = new RecursoPorRubro(); recursoPorRubro.setFromObject(dataBody);
		this.recursoPorRubroService.add(recursoPorRubro)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const recursoPorRubro = new RecursoPorRubro(); recursoPorRubro.setFromObject(dataBody);
		this.recursoPorRubroService.modify(id, recursoPorRubro)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.recursoPorRubroService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
