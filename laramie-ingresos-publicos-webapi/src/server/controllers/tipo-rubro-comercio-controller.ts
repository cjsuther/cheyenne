import TipoRubroComercio from '../../domain/entities/tipo-rubro-comercio';
import TipoRubroComercioService from '../../domain/services/tipo-rubro-comercio-service';

export default class TipoRubroComercioController {

	tipoRubroComercioService: TipoRubroComercioService;

	constructor(tipoRubroComercioService: TipoRubroComercioService) {
		this.tipoRubroComercioService = tipoRubroComercioService;
	}

	get = async (req, res, next) => {
		this.tipoRubroComercioService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.tipoRubroComercioService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const tipoRubroComercio = new TipoRubroComercio(); tipoRubroComercio.setFromObject(dataBody);
		this.tipoRubroComercioService.add(tipoRubroComercio)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const tipoRubroComercio = new TipoRubroComercio(); tipoRubroComercio.setFromObject(dataBody);
		this.tipoRubroComercioService.modify(id, tipoRubroComercio)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.tipoRubroComercioService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
