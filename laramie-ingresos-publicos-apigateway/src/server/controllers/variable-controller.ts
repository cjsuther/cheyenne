import VariableService from '../../domain/services/variable-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber, isValidString, isValidObject } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class VariableController {

	variableService: VariableService;

	constructor(variableService: VariableService) {
		this.variableService = variableService;
	}

	get = (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.variableService.list(token)
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
		
		this.variableService.findById(token, id)
			.then(row => res.send(row))
			.catch(next)
	}

	getVariableByCuenta = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		const codigo = req.params.codigo;
		const idCuenta = req.params.idCuenta;

		if (!token || !isValidNumber(idCuenta, true) || !isValidString(codigo, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		
		this.variableService.getVariableByCuenta(token, codigo, idCuenta)
			.then(row => res.send(row))
			.catch(next)

	}

	getVariableGlobalByCodigo = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		const codigo = req.params.codigo;

		if (!token || !isValidString(codigo, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		
		this.variableService.getVariableGlobalByCodigo(token, codigo)
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

		this.variableService.add(token, dataBody)
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

		this.variableService.modify(token, id, dataBody)
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

		this.variableService.remove(token, id)
			.then(id => res.send(id))
			.catch(next)
	}

}
