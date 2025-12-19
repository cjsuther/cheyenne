import CuentaCorrienteCondicionEspecial from '../../domain/entities/cuenta-corriente-condicion-especial';
import CuentaCorrienteCondicionEspecialService from '../../domain/services/cuenta-corriente-condicion-especial-service';

export default class CuentaCorrienteCondicionEspecialController {

	cuentaCorrienteCondicionEspecialService: CuentaCorrienteCondicionEspecialService;

	constructor(cuentaCorrienteCondicionEspecialService: CuentaCorrienteCondicionEspecialService) {
		this.cuentaCorrienteCondicionEspecialService = cuentaCorrienteCondicionEspecialService;
	}

	get = (req, res, next) => {
		this.cuentaCorrienteCondicionEspecialService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getByCuenta = (req, res, next) => {
		const idCuenta = req.params.idCuenta;
		this.cuentaCorrienteCondicionEspecialService.listByCuenta(idCuenta)
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.cuentaCorrienteCondicionEspecialService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const dataBody = {...req.body};
		const cuentaCorrienteCondicionEspecial = new CuentaCorrienteCondicionEspecial(); cuentaCorrienteCondicionEspecial.setFromObject(dataBody);
		this.cuentaCorrienteCondicionEspecialService.add(cuentaCorrienteCondicionEspecial)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const cuentaCorrienteCondicionEspecial = new CuentaCorrienteCondicionEspecial(); cuentaCorrienteCondicionEspecial.setFromObject(dataBody);
		this.cuentaCorrienteCondicionEspecialService.modify(id, cuentaCorrienteCondicionEspecial)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.cuentaCorrienteCondicionEspecialService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
