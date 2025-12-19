import MedioPago from '../../domain/entities/medio-pago';
import MedioPagoService from '../../domain/services/medio-pago-service';

export default class MedioPagoController {

	medioPagoService: MedioPagoService;

	constructor(medioPagoService: MedioPagoService) {
		this.medioPagoService = medioPagoService;
	}

	get = (req, res, next) => {
		this.medioPagoService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getByPersona = (req, res, next) => {
		const idTipoPersona = req.params.idTipoPersona;
		const idPersona = req.params.idPersona;
		this.medioPagoService.listByPersona(idTipoPersona, idPersona)
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.medioPagoService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const dataBody = {...req.body};
		const medioPago = new MedioPago(); medioPago.setFromObject(dataBody);
		this.medioPagoService.add(medioPago)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const medioPago = new MedioPago(); medioPago.setFromObject(dataBody);
		this.medioPagoService.modify(id, medioPago)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.medioPagoService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
