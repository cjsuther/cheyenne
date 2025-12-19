import CuentaCorrienteCondicionEspecialService from '../../domain/services/cuenta-corriente-condicion-especial-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber, isValidObject } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class CuentaCorrienteCondicionEspecialController {

	cuentaCorrienteCondicionEspecialService: CuentaCorrienteCondicionEspecialService;

	constructor(cuentaCorrienteCondicionEspecialService: CuentaCorrienteCondicionEspecialService) {
		this.cuentaCorrienteCondicionEspecialService = cuentaCorrienteCondicionEspecialService;
	}

	get = (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.cuentaCorrienteCondicionEspecialService.list(token)
			.then(data => res.send(data))
			.catch(next)
	}

	getByCuenta = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idCuenta = req.params.idCuenta;
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.cuentaCorrienteCondicionEspecialService.listByCuenta(token, idCuenta)
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		if (!token || !isValidNumber(id, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		
		this.cuentaCorrienteCondicionEspecialService.findById(token, id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const dataBody = {...req.body};
		if (!token || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.cuentaCorrienteCondicionEspecialService.add(token, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		const dataBody = {...req.body};
		if (!token || !isValidNumber(id, true) || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.cuentaCorrienteCondicionEspecialService.modify(token, id, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		if (!token || !isValidNumber(id, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.cuentaCorrienteCondicionEspecialService.remove(token, id)
			.then(id => res.send(id))
			.catch(next)
	}

}
