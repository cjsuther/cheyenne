import CuentaPrueba from '../../domain/entities/cuenta-prueba';
import CuentaPruebaService from '../../domain/services/cuenta-prueba-service';

export default class CuentaPruebaController {

	cuentaPruebaService: CuentaPruebaService;

	constructor(cuentaPruebaService: CuentaPruebaService) {
		this.cuentaPruebaService = cuentaPruebaService;
	}

	get = async (req, res, next) => {
		this.cuentaPruebaService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.cuentaPruebaService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const cuentaPrueba = new CuentaPrueba(); cuentaPrueba.setFromObject(dataBody);
		this.cuentaPruebaService.add(cuentaPrueba)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const cuentaPrueba = new CuentaPrueba(); cuentaPrueba.setFromObject(dataBody);
		this.cuentaPruebaService.modify(id, cuentaPrueba)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.cuentaPruebaService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
