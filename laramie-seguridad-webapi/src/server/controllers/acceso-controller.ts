import Acceso from '../../domain/entities/acceso';
import AccesoService from '../../domain/services/acceso-service';

export default class AccesoController {

	accesoService: AccesoService;

	constructor(accesoService: AccesoService) {
		this.accesoService = accesoService;
	}

	get = (req, res, next) => {
		this.accesoService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.accesoService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const dataBody = {...req.body};
		const acceso = new Acceso(); acceso.setFromObject(dataBody);
		this.accesoService.add(acceso)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const acceso = new Acceso(); acceso.setFromObject(dataBody);
		this.accesoService.modify(id, acceso)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.accesoService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
