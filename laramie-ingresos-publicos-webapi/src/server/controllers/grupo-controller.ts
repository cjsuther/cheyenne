import Grupo from '../../domain/entities/grupo';
import GrupoService from '../../domain/services/grupo-service';

export default class GrupoController {

	grupoService: GrupoService;

	constructor(grupoService: GrupoService) {
		this.grupoService = grupoService;
	}

	get = async (req, res, next) => {
		this.grupoService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.grupoService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const grupo = new Grupo(); grupo.setFromObject(dataBody);
		this.grupoService.add(grupo)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const grupo = new Grupo(); grupo.setFromObject(dataBody);
		this.grupoService.modify(id, grupo)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.grupoService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
