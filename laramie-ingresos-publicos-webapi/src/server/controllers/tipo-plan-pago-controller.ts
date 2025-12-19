import TipoPlanPago from '../../domain/entities/tipo-plan-pago';
import TipoPlanPagoService from '../../domain/services/tipo-plan-pago-service';

export default class TipoPlanPagoController {

	tipoPlanPagoService: TipoPlanPagoService;

	constructor(tipoPlanPagoService: TipoPlanPagoService) {
		this.tipoPlanPagoService = tipoPlanPagoService;
	}

	get = (req, res, next) => {
		this.tipoPlanPagoService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.tipoPlanPagoService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const dataBody = {...req.body};
		const tipoPlanPago = new TipoPlanPago(); tipoPlanPago.setFromObject(dataBody);
		this.tipoPlanPagoService.add(tipoPlanPago)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const tipoPlanPago = new TipoPlanPago(); tipoPlanPago.setFromObject(dataBody);
		this.tipoPlanPagoService.modify(id, tipoPlanPago)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.tipoPlanPagoService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
