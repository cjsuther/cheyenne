import PagoRendicionLote from '../../domain/entities/pago-rendicion-lote';
import PagoRendicionLoteService from '../../domain/services/pago-rendicion-lote-service';

export default class PagoRendicionLoteController {

	pagoRendicionLoteService: PagoRendicionLoteService;

	constructor(pagoRendicionLoteService: PagoRendicionLoteService) {
		this.pagoRendicionLoteService = pagoRendicionLoteService;
	}

	get = async (req, res, next) => {
		this.pagoRendicionLoteService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getDetalle = async (req, res, next) => {
		const id = req.params.id;
		this.pagoRendicionLoteService.listDetalle(id)
			.then(data => res.send(data))
			.catch(next)
	}	

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.pagoRendicionLoteService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const pagoRendicionLote = new PagoRendicionLote(); pagoRendicionLote.setFromObject(dataBody);
		this.pagoRendicionLoteService.add(pagoRendicionLote)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const pagoRendicionLote = new PagoRendicionLote(); pagoRendicionLote.setFromObject(dataBody);
		this.pagoRendicionLoteService.modify(id, pagoRendicionLote)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.pagoRendicionLoteService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
