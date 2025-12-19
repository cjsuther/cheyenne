import ZonaGeoreferencia from '../../domain/entities/zona-georeferencia';
import ZonaGeoreferenciaService from '../../domain/services/zona-georeferencia-service';

export default class ZonaGeoreferenciaController {

	zonaGeoreferenciaService: ZonaGeoreferenciaService;

	constructor(zonaGeoreferenciaService: ZonaGeoreferenciaService) {
		this.zonaGeoreferenciaService = zonaGeoreferenciaService;
	}

	get = async (req, res, next) => {
		this.zonaGeoreferenciaService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.zonaGeoreferenciaService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const zonaGeoreferencia = new ZonaGeoreferencia(); zonaGeoreferencia.setFromObject(dataBody);
		this.zonaGeoreferenciaService.add(zonaGeoreferencia)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const zonaGeoreferencia = new ZonaGeoreferencia(); zonaGeoreferencia.setFromObject(dataBody);
		this.zonaGeoreferenciaService.modify(id, zonaGeoreferencia)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.zonaGeoreferenciaService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
