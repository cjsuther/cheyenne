import TipoVencimientoPlanPago from '../../domain/entities/tipo-vencimiento-plan-pago';
import TipoVencimientoPlanPagoService from '../../domain/services/tipo-vencimiento-plan-pago-service';

export default class TipoVencimientoPlanPagoController {

	tipoVencimientoPlanPagoService: TipoVencimientoPlanPagoService;

	constructor(tipoVencimientoPlanPagoService: TipoVencimientoPlanPagoService) {
		this.tipoVencimientoPlanPagoService = tipoVencimientoPlanPagoService;
	}

	get = async (req, res, next) => {
		this.tipoVencimientoPlanPagoService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.tipoVencimientoPlanPagoService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const tipoVencimientoPlanPago = new TipoVencimientoPlanPago(); tipoVencimientoPlanPago.setFromObject(dataBody);
		this.tipoVencimientoPlanPagoService.add(tipoVencimientoPlanPago)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const tipoVencimientoPlanPago = new TipoVencimientoPlanPago(); tipoVencimientoPlanPago.setFromObject(dataBody);
		this.tipoVencimientoPlanPagoService.modify(id, tipoVencimientoPlanPago)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.tipoVencimientoPlanPagoService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
