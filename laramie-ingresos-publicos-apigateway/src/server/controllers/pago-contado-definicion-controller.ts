import PagoContadoDefinicionService from '../../domain/services/pago-contado-definicion-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber, isValidObject } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class PagoContadoDefinicionController {

	pagoContadoDefinicionService: PagoContadoDefinicionService;

	constructor(pagoContadoDefinicionService: PagoContadoDefinicionService) {
		this.pagoContadoDefinicionService = pagoContadoDefinicionService;
	}

	get = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.pagoContadoDefinicionService.list(token)
			.then(data => res.send(data))
			.catch(next)
	}

	getByFilter = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idTipoPlanPago = req.query.idTipoPlanPago;
		const idTipoTributo = req.query.idTipoTributo;
		const idTasaPagoContado = req.query.idTasaPagoContado;
		const idSubTasaPagoContado = req.query.idSubTasaPagoContado;
		const idEstadoPagoContadoDefinicion = req.query.idEstadoPagoContadoDefinicion;
		const fechaDesde = req.query.fechaDesde;
		const fechaHasta = req.query.fechaHasta;
		const descripcion = req.query.descripcion;
		const etiqueta = req.query.etiqueta;
	
		this.pagoContadoDefinicionService.listByFilter(token, idTipoPlanPago, idTipoTributo, idTasaPagoContado, idSubTasaPagoContado, idEstadoPagoContadoDefinicion, fechaDesde, fechaHasta, descripcion, etiqueta)
		  .then(data => res.send(data))
		  .catch(next)
	}

	getByCuenta = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idCuenta = req.params.idCuenta;
		const dataBody = {...req.body};
		if (!token || !isValidNumber(idCuenta, true) || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.pagoContadoDefinicionService.listByCuenta(token, idCuenta, dataBody)
			.then(data => res.send(data))
			.catch(next)
	}

	getByCuotas = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		const dataBody = {...req.body};
		if (!token || !isValidNumber(id, true) || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.pagoContadoDefinicionService.listByCuotas(token, id, dataBody)
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
		
		this.pagoContadoDefinicionService.findById(token, id)
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

		this.pagoContadoDefinicionService.add(token, dataBody)
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

		this.pagoContadoDefinicionService.modify(token, id, dataBody)
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

		this.pagoContadoDefinicionService.remove(token, id)
			.then(id => res.send(id))
			.catch(next)
	}

}
