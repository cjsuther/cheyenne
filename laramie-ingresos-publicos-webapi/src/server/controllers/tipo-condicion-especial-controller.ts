import TipoCondicionEspecial from '../../domain/entities/tipo-condicion-especial';
import TipoCondicionEspecialService from '../../domain/services/tipo-condicion-especial-service';

export default class TipoCondicionEspecialController {

	tipoCondicionEspecialService: TipoCondicionEspecialService;

	constructor(tipoCondicionEspecialService: TipoCondicionEspecialService) {
		this.tipoCondicionEspecialService = tipoCondicionEspecialService;
	}

	get = async (req, res, next) => {
		this.tipoCondicionEspecialService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.tipoCondicionEspecialService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const tipoCondicionEspecial = new TipoCondicionEspecial(); tipoCondicionEspecial.setFromObject(dataBody);
		this.tipoCondicionEspecialService.add(tipoCondicionEspecial)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const tipoCondicionEspecial = new TipoCondicionEspecial(); tipoCondicionEspecial.setFromObject(dataBody);
		this.tipoCondicionEspecialService.modify(id, tipoCondicionEspecial)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.tipoCondicionEspecialService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
