import Contribuyente from '../../domain/entities/contribuyente';
import ContribuyenteService from '../../domain/services/contribuyente-service';

export default class ContribuyenteController {

	contribuyenteService: ContribuyenteService;

	constructor(contribuyenteService: ContribuyenteService) {
		this.contribuyenteService = contribuyenteService;
	}

	get = (req, res, next) => {
		const id = req.params.id;
		this.contribuyenteService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getByCuenta = (req, res, next) => {
		const idCuenta = req.params.idCuenta
		this.contribuyenteService.listByCuenta(idCuenta)
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.contribuyenteService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	getByPersona = (req, res, next) => {
		const idPersona = req.params.idPersona;
		this.contribuyenteService.findByPersona(idPersona)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const dataBody = {...req.body};
		const contribuyente = new Contribuyente(); contribuyente.setFromObject(dataBody);
		this.contribuyenteService.add(contribuyente)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const contribuyente = new Contribuyente(); contribuyente.setFromObject(dataBody);
		this.contribuyenteService.modify(id, contribuyente)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.contribuyenteService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
