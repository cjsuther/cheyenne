import CajaService from '../../domain/services/caja-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber, isValidObject } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';


export default class CajaController {

	cajaService: CajaService;

	constructor(cajaService: CajaService) {
		this.cajaService = cajaService;
	}

	get = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.cajaService.list(token)
			.then(data => res.send(data))
			.catch(next)
	}

	getByDependencia = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idDependencia = req.params.idDependencia;
		if (!token || !isValidNumber(idDependencia, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.cajaService.listByDependencia(token, idDependencia)
			.then(data => res.send(data))
			.catch(next)
	}

	getCierreTesoreria = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.cajaService.listCierreTesoreria(token)
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		if (!token || !isValidNumber(id, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		
		this.cajaService.findById(token, id)
			.then(row => res.send(row))
			.catch(next)
	}

	getResumenById = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		if (!token || !isValidNumber(id, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		
		this.cajaService.findResumenById(token, id)
			.then(row => res.send(row))
			.catch(next)
	}

	getResumenByCajaAsignacion = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idCajaAsignacion = req.params.idCajaAsignacion;
		if (!token || !isValidNumber(idCajaAsignacion, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		
		this.cajaService.findResumenByCajaAsignacion(token, idCajaAsignacion)
			.then(row => res.send(row))
			.catch(next)
	}

	getCajaAsignacion = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		this.cajaService.listCajaAsignacion(token)
			.then(row => res.send(row))
			.catch(next)
	}

	getCajaAsignacionByIdCaja = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idCaja = req.params.idCaja;
		this.cajaService.listCajaAsignacionByIdCaja(token, idCaja)
			.then(row => res.send(row))
			.catch(next)
	}

	getUsuarioLogin = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		const dataToken = verifyAccessToken(token);
		if (!dataToken) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		
		this.cajaService.findUsuario(token, dataToken.idUsuario)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		const dataBody = {...req.body};
		if (!token || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.cajaService.add(token, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		const dataBody = {...req.body};
		if (!token || !isValidNumber(id, true) || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.cajaService.modify(token, id, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	putApertura = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		const dataBody = {...req.body};
		if (!token || !isValidNumber(id, true) || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.cajaService.modifyApertura(token, id, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	putCierre = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		if (!token || !isValidNumber(id, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.cajaService.modifyCierre(token, id)
			.then(row => res.send(row))
			.catch(next)
	}

	putMovimientoCobranza = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		const dataBody = {...req.body};
		if (!token || !isValidNumber(id, true) || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.cajaService.modifyMovimientoCobranza(token, id, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	putMovimientoRetiro = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		const dataBody = {...req.body};
		if (!token || !isValidNumber(id, true) || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.cajaService.modifyMovimientoRetiro(token, id, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	putMovimientoIngreso = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		const dataBody = {...req.body};
		if (!token || !isValidNumber(id, true) || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.cajaService.modifyMovimientoIngreso(token, id, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	deleteMovimiento = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idMovimientoCaja = req.params.idMovimientoCaja;
		if (!token || !isValidNumber(idMovimientoCaja, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		
		this.cajaService.removeMovimiento(token, idMovimientoCaja)
			.then(row => res.send(row))
			.catch(next)
	}

	putCierreTesoreria = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		const dataBody = {...req.body};
		if (!token || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.cajaService.modifyCierreTesoreria(token, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		if (!token || !isValidNumber(id, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.cajaService.remove(token, id)
			.then(id => res.send(id))
			.catch(next)
	}

}
