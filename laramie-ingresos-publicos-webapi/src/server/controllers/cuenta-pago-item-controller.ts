import CuentaPagoItem from '../../domain/entities/cuenta-pago-item';
import CuentaPagoItemService from '../../domain/services/cuenta-pago-item-service';

export default class CuentaPagoItemController {

	cuentaPagoItemService: CuentaPagoItemService;

	constructor(cuentaPagoItemService: CuentaPagoItemService) {
		this.cuentaPagoItemService = cuentaPagoItemService;
	}

	get = (req, res, next) => {
		this.cuentaPagoItemService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.cuentaPagoItemService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const dataBody = {...req.body};
		const cuentaPagoItem = new CuentaPagoItem(); cuentaPagoItem.setFromObject(dataBody);
		this.cuentaPagoItemService.add(cuentaPagoItem)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const cuentaPagoItem = new CuentaPagoItem(); cuentaPagoItem.setFromObject(dataBody);
		this.cuentaPagoItemService.modify(id, cuentaPagoItem)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.cuentaPagoItemService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
