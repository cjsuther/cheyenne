import TipoAnuncio from '../../domain/entities/tipo-anuncio';
import TipoAnuncioService from '../../domain/services/tipo-anuncio-service';

export default class TipoAnuncioController {

	tipoAnuncioService: TipoAnuncioService;

	constructor(tipoAnuncioService: TipoAnuncioService) {
		this.tipoAnuncioService = tipoAnuncioService;
	}

	get = async (req, res, next) => {
		this.tipoAnuncioService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.tipoAnuncioService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const tipoAnuncio = new TipoAnuncio(); tipoAnuncio.setFromObject(dataBody);
		this.tipoAnuncioService.add(tipoAnuncio)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const tipoAnuncio = new TipoAnuncio(); tipoAnuncio.setFromObject(dataBody);
		this.tipoAnuncioService.modify(id, tipoAnuncio)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.tipoAnuncioService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
