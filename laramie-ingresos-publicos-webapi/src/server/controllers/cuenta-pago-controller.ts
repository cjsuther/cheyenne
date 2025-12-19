import CuentaPago from '../../domain/entities/cuenta-pago';
import CuentaPagoItem from '../../domain/entities/cuenta-pago-item';
import CuentaPagoService from '../../domain/services/cuenta-pago-service';

export default class CuentaPagoController {

	cuentaPagoService: CuentaPagoService;

	constructor(cuentaPagoService: CuentaPagoService) {
		this.cuentaPagoService = cuentaPagoService;
	}

	get = (req, res, next) => {
		this.cuentaPagoService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.cuentaPagoService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const dataBody = {...req.body};
		const cuentaPago = new CuentaPago(); cuentaPago.setFromObject(dataBody);
		this.cuentaPagoService.add(cuentaPago)
			.then(row => res.send(row))
			.catch(next)
	}

	postAnticipado = (req, res, next) => {
		const dataBody = {...req.body};
		const idCuenta = dataBody.idCuenta;
		let cuentaPagoItems: Array<CuentaPagoItem> = [];
		dataBody.cuentaPagoItems.forEach(item => {
			let cuentaPagoItem = new CuentaPagoItem(); cuentaPagoItem.setFromObject(item);
			cuentaPagoItems.push(cuentaPagoItem);
		});
		this.cuentaPagoService.addAnticipado(idCuenta, cuentaPagoItems)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const cuentaPago = new CuentaPago(); cuentaPago.setFromObject(dataBody);
		this.cuentaPagoService.modify(id, cuentaPago)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.cuentaPagoService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
