import TipoElemento from '../../domain/entities/tipo-elemento';
import TipoElementoService from '../../domain/services/tipo-elemento-service';

export default class TipoElementoController {

	tipoElementoService: TipoElementoService;

	constructor(tipoElementoService: TipoElementoService) {
		this.tipoElementoService = tipoElementoService;
	}

	get = async (req, res, next) => {
		this.tipoElementoService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getByClaseElemento = async (req, res, next) => {
		const idClaseElemento = req.params.idClaseElemento;
		this.tipoElementoService.listByClaseElemento(idClaseElemento)
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.tipoElementoService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const tipoElemento = new TipoElemento(); tipoElemento.setFromObject(dataBody);
		this.tipoElementoService.add(tipoElemento)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const tipoElemento = new TipoElemento(); tipoElemento.setFromObject(dataBody);
		this.tipoElementoService.modify(id, tipoElemento)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.tipoElementoService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
