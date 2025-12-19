import ZonaTarifaria from '../../domain/entities/zona-tarifaria';
import ZonaTarifariaService from '../../domain/services/zona-tarifaria-service';

export default class ZonaTarifariaController {

	zonaTarifariaService: ZonaTarifariaService;

	constructor(zonaTarifariaService: ZonaTarifariaService) {
		this.zonaTarifariaService = zonaTarifariaService;
	}

	get = async (req, res, next) => {
		this.zonaTarifariaService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.zonaTarifariaService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const zonaTarifaria = new ZonaTarifaria(); zonaTarifaria.setFromObject(dataBody);
		this.zonaTarifariaService.add(zonaTarifaria)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const zonaTarifaria = new ZonaTarifaria(); zonaTarifaria.setFromObject(dataBody);
		this.zonaTarifariaService.modify(id, zonaTarifaria)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.zonaTarifariaService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
