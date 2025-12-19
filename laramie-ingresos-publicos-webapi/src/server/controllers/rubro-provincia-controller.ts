import RubroProvincia from '../../domain/entities/rubro-provincia';
import RubroProvinciaService from '../../domain/services/rubro-provincia-service';

export default class RubroProvinciaController {

	rubroProvinciaService: RubroProvinciaService;

	constructor(rubroProvinciaService: RubroProvinciaService) {
		this.rubroProvinciaService = rubroProvinciaService;
	}

	get = async (req, res, next) => {
		this.rubroProvinciaService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.rubroProvinciaService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const rubroProvincia = new RubroProvincia(); rubroProvincia.setFromObject(dataBody);
		this.rubroProvinciaService.add(rubroProvincia)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const rubroProvincia = new RubroProvincia(); rubroProvincia.setFromObject(dataBody);
		this.rubroProvinciaService.modify(id, rubroProvincia)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.rubroProvinciaService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
