import Etiqueta from '../../domain/entities/etiqueta';
import EtiquetaService from '../../domain/services/etiqueta-service';

export default class EtiquetaController {

	etiquetaService: EtiquetaService;

	constructor(etiquetaService: EtiquetaService) {
		this.etiquetaService = etiquetaService;
	}

	get = (req, res, next) => {
		this.etiquetaService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getByEntidad = (req, res, next) => {
		const entidad = req.params.entidad;
		const idEntidad = req.params.idEntidad;
		this.etiquetaService.listByEntidad(entidad, idEntidad)
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.etiquetaService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const dataBody = {...req.body};
		const etiqueta = new Etiqueta(); etiqueta.setFromObject(dataBody);
		this.etiquetaService.add(etiqueta)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const etiqueta = new Etiqueta(); etiqueta.setFromObject(dataBody);
		this.etiquetaService.modify(id, etiqueta)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.etiquetaService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
