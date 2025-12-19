import Rubro from '../../domain/entities/rubro';
import RubroService from '../../domain/services/rubro-service';

export default class RubroController {

	rubroService: RubroService;

	constructor(rubroService: RubroService) {
		this.rubroService = rubroService;
	}

	get = async (req, res, next) => {
		this.rubroService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.rubroService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const rubro = new Rubro(); rubro.setFromObject(dataBody);
		this.rubroService.add(rubro)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const rubro = new Rubro(); rubro.setFromObject(dataBody);
		this.rubroService.modify(id, rubro)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.rubroService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
