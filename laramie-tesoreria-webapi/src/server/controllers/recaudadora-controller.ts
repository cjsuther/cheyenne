import Recaudadora from '../../domain/entities/recaudadora';
import RecaudadoraService from '../../domain/services/recaudadora-service';

export default class RecaudadoraController {

	recaudadoraService: RecaudadoraService;

	constructor(recaudadoraService: RecaudadoraService) {
		this.recaudadoraService = recaudadoraService;
	}

	get = async (req, res, next) => {
		this.recaudadoraService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.recaudadoraService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const recaudadora = new Recaudadora(); recaudadora.setFromObject(dataBody);
		this.recaudadoraService.add(recaudadora)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const recaudadora = new Recaudadora(); recaudadora.setFromObject(dataBody);
		this.recaudadoraService.modify(id, recaudadora)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.recaudadoraService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
