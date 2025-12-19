import TipoSuperficie from '../../domain/entities/tipo-superficie';
import TipoSuperficieService from '../../domain/services/tipo-superficie-service';

export default class TipoSuperficieController {

	tipoSuperficieService: TipoSuperficieService;

	constructor(tipoSuperficieService: TipoSuperficieService) {
		this.tipoSuperficieService = tipoSuperficieService;
	}

	get = async (req, res, next) => {
		this.tipoSuperficieService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.tipoSuperficieService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const tipoSuperficie = new TipoSuperficie(); tipoSuperficie.setFromObject(dataBody);
		this.tipoSuperficieService.add(tipoSuperficie)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const tipoSuperficie = new TipoSuperficie(); tipoSuperficie.setFromObject(dataBody);
		this.tipoSuperficieService.modify(id, tipoSuperficie)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.tipoSuperficieService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
