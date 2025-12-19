import Filtro from '../../domain/entities/filtro';
import FiltroService from '../../domain/services/filtro-service';

export default class FiltroController {

	filtroService: FiltroService;

	constructor(filtroService: FiltroService) {
		this.filtroService = filtroService;
	}

	get = async (req, res, next) => {
		this.filtroService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.filtroService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const filtro = new Filtro(); filtro.setFromObject(dataBody);
		this.filtroService.add(filtro)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const filtro = new Filtro(); filtro.setFromObject(dataBody);
		this.filtroService.modify(id, filtro)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.filtroService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
