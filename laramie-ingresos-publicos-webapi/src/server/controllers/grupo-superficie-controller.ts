import GrupoSuperficie from '../../domain/entities/grupo-superficie';
import GrupoSuperficieService from '../../domain/services/grupo-superficie-service';

export default class GrupoSuperficieController {

	grupoSuperficieService: GrupoSuperficieService;

	constructor(grupoSuperficieService: GrupoSuperficieService) {
		this.grupoSuperficieService = grupoSuperficieService;
	}

	get = async (req, res, next) => {
		this.grupoSuperficieService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.grupoSuperficieService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const grupoSuperficie = new GrupoSuperficie(); grupoSuperficie.setFromObject(dataBody);
		this.grupoSuperficieService.add(grupoSuperficie)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const grupoSuperficie = new GrupoSuperficie(); grupoSuperficie.setFromObject(dataBody);
		this.grupoSuperficieService.modify(id, grupoSuperficie)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.grupoSuperficieService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
