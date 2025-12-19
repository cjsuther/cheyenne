import ClaseElemento from '../../domain/entities/clase-elemento';
import ClaseElementoService from '../../domain/services/clase-elemento-service';

export default class ClaseElementoController {

	claseElementoService: ClaseElementoService;

	constructor(claseElementoService: ClaseElementoService) {
		this.claseElementoService = claseElementoService;
	}

	get = async (req, res, next) => {
		this.claseElementoService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.claseElementoService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const claseElemento = new ClaseElemento(); claseElemento.setFromObject(dataBody);
		this.claseElementoService.add(claseElemento)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const claseElemento = new ClaseElemento(); claseElemento.setFromObject(dataBody);
		this.claseElementoService.modify(id, claseElemento)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.claseElementoService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
