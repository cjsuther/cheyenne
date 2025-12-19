import RubroBCRA from '../../domain/entities/rubro-bcra';
import RubroBCRAService from '../../domain/services/rubro-bcra-service';

export default class RubroBCRAController {

	rubroBCRAService: RubroBCRAService;

	constructor(rubroBCRAService: RubroBCRAService) {
		this.rubroBCRAService = rubroBCRAService;
	}

	get = async (req, res, next) => {
		this.rubroBCRAService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.rubroBCRAService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const rubroBCRA = new RubroBCRA(); rubroBCRA.setFromObject(dataBody);
		this.rubroBCRAService.add(rubroBCRA)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const rubroBCRA = new RubroBCRA(); rubroBCRA.setFromObject(dataBody);
		this.rubroBCRAService.modify(id, rubroBCRA)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.rubroBCRAService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
