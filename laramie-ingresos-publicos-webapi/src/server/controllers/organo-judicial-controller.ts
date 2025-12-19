import OrganoJudicial from '../../domain/entities/organo-judicial';
import OrganoJudicialService from '../../domain/services/organo-judicial-service';

export default class OrganoJudicialController {

	organoJudicialService: OrganoJudicialService;

	constructor(organoJudicialService: OrganoJudicialService) {
		this.organoJudicialService = organoJudicialService;
	}

	get = (req, res, next) => {
		this.organoJudicialService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.organoJudicialService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const dataBody = {...req.body};
		const organoJudicial = new OrganoJudicial(); organoJudicial.setFromObject(dataBody);
		this.organoJudicialService.add(organoJudicial)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const organoJudicial = new OrganoJudicial(); organoJudicial.setFromObject(dataBody);
		this.organoJudicialService.modify(id, organoJudicial)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.organoJudicialService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
