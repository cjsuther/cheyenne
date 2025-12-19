import CuentaContable from '../../domain/entities/cuenta-contable';
import CuentaContableService from '../../domain/services/cuenta-contable-service';

export default class CuentaContableController {

	cuentaContableService: CuentaContableService;

	constructor(cuentaContableService: CuentaContableService) {
		this.cuentaContableService = cuentaContableService;
	}

	get = async (req, res, next) => {
		this.cuentaContableService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.cuentaContableService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const cuentaContable = new CuentaContable(); cuentaContable.setFromObject(dataBody);
		this.cuentaContableService.add(cuentaContable)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const cuentaContable = new CuentaContable(); cuentaContable.setFromObject(dataBody);
		this.cuentaContableService.modify(id, cuentaContable)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.cuentaContableService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
