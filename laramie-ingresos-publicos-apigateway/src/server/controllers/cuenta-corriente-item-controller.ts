import CuentaCorrienteItemService from '../../domain/services/cuenta-corriente-item-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isEmpty, isValidDate, isValidNumber, isValidObject } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class CuentaCorrienteItemController {

	cuentaCorrienteItemService: CuentaCorrienteItemService;

	constructor(cuentaCorrienteItemService: CuentaCorrienteItemService) {
		this.cuentaCorrienteItemService = cuentaCorrienteItemService;
	}

	get = (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.cuentaCorrienteItemService.list(token)
			.then(data => res.send(data))
			.catch(next)
	}

	getByFilter = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idCuenta = req.query.idCuenta;
		const incluyePlanes = req.query.incluyePlanes;
		const fechaDesde = req.query.fechaDesde;
		const fechaHasta = req.query.fechaHasta;
		const fechaDeuda = req.query.fechaDeuda;

		if (!token || !isValidNumber(idCuenta, false)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		if (!isEmpty(fechaDesde) && !isValidDate(fechaDesde)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		if (!isEmpty(fechaHasta) && !isValidDate(fechaHasta)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		if (!isEmpty(fechaDeuda) && !isValidDate(fechaDeuda)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.cuentaCorrienteItemService.listByFilter(token,  idCuenta, incluyePlanes, fechaDesde, fechaHasta, fechaDeuda)
		  .then(data => res.send(data))
		  .catch(next)
	}

	getByCuenta = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idCuenta = req.params.idCuenta;
		if (!token || !isValidNumber(idCuenta, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		
		this.cuentaCorrienteItemService.listByCuenta(token, idCuenta)
			.then(data => res.send(data))
			.catch(next)
	}

	getByCredito = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idCuenta = req.params.idCuenta;
		if (!token || !isValidNumber(idCuenta, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		
		this.cuentaCorrienteItemService.listByCredito(token, idCuenta)
			.then(data => res.send(data))
			.catch(next)
	}

	getByDeuda = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idCuenta = req.params.idCuenta;
		if (!token || !isValidNumber(idCuenta, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		
		this.cuentaCorrienteItemService.listByDeuda(token, idCuenta)
			.then(data => res.send(data))
			.catch(next)
	}

	getByDeudaVencimiento = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idCuenta = req.params.idCuenta;
		const fechaVencimiento = req.params.fechaVencimiento;
		if (!token || !isValidNumber(idCuenta, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		if (!isEmpty(fechaVencimiento) && !isValidDate(fechaVencimiento)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		
		this.cuentaCorrienteItemService.listByDeudaVencimiento(token, idCuenta, fechaVencimiento)
			.then(data => res.send(data))
			.catch(next)
	}

	getByContribuyente =  (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idContribuyente = req.params.idContribuyente;
		if (!token || !isValidNumber(idContribuyente, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		
		this.cuentaCorrienteItemService.listByContribuyente(token, idContribuyente)
			.then(data => res.send(data))
			.catch(next)
	}

	getByPagoACuenta = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const dataBody = {...req.body};
		if (!token || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.cuentaCorrienteItemService.listByPagoACuenta(token, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	getById = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		if (!token || !isValidNumber(id, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		
		this.cuentaCorrienteItemService.findById(token, id)
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

		this.cuentaCorrienteItemService.add(token, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	postReciboComun = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const dataBody = {...req.body};
		if (!token || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.cuentaCorrienteItemService.addReciboComun(token, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	postPagoReciboEspecial = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const dataBody = {...req.body};
		if (!token || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.cuentaCorrienteItemService.addPagoReciboEspecial(token, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	postByPagoACuenta = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const dataBody = {...req.body};
		if (!token || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.cuentaCorrienteItemService.addByPagoACuenta(token, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	postCredito = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const dataBody = {...req.body};
		if (!token || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.cuentaCorrienteItemService.addCredito(token, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	postDebitoCredito = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const dataBody = {...req.body};
		if (!token || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.cuentaCorrienteItemService.addByDebitoCredito(token, dataBody)
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

		this.cuentaCorrienteItemService.modify(token, id, dataBody)
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

		this.cuentaCorrienteItemService.remove(token, id)
			.then(id => res.send(id))
			.catch(next)
	}

}
