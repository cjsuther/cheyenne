import RecaudacionLoteService from '../../domain/services/recaudacion-lote-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber, isValidObject } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class RecaudacionLoteController {

	recaudacionLoteService: RecaudacionLoteService;

	constructor(recaudacionLoteService: RecaudacionLoteService) {
		this.recaudacionLoteService = recaudacionLoteService;
	}

	get = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.recaudacionLoteService.list(token)
			.then(data => res.send(data))
			.catch(next)
	}

	getDetalle = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		if (!token || !isValidNumber(id, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.recaudacionLoteService.listDetalle(token, id)
			.then(data => res.send(data))
			.catch(next)
	}

	getControl = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.recaudacionLoteService.listControl(token)
			.then(data => res.send(data))
			.catch(next)
	}

	getConciliacion = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.recaudacionLoteService.listConciliacion(token)
			.then(data => res.send(data))
			.catch(next)
	}

	getIngresosPublicos = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.recaudacionLoteService.listIngresosPublicos(token)
			.then(data => res.send(data))
			.catch(next)
	}

	getRegistroContable = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.recaudacionLoteService.listRegistroContable(token)
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
		
		this.recaudacionLoteService.findById(token, id)
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

		this.recaudacionLoteService.add(token, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	postImportacionPreview = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		const dataBody = {...req.body};
		if (!token || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.recaudacionLoteService.addImportacionPreview(token, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	postImportacionConfirmacion = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		const dataBody = {...req.body};
		if (!token || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.recaudacionLoteService.addImportacionConfirmacion(token, dataBody)
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

		this.recaudacionLoteService.modify(token, id, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	putControl = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		const dataBody = {...req.body};
		if (!token || !isValidNumber(id, true) || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.recaudacionLoteService.modifyControl(token, id, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	putConciliacionManual = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idRecaudacion = req.params.idRecaudacion;
		if (!token || !isValidNumber(idRecaudacion, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.recaudacionLoteService.modifyConciliacionManual(token, idRecaudacion)
			.then(row => res.send(row))
			.catch(next)
	}

	putIngresosPublicos = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		const dataBody = {...req.body};
		if (!token || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.recaudacionLoteService.modifyIngresosPublicos(token, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	putRegistroContable = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		const dataBody = {...req.body};
		if (!token || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.recaudacionLoteService.modifyRegistroContable(token, dataBody)
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

		this.recaudacionLoteService.remove(token, id)
			.then(id => res.send(id))
			.catch(next)
	}

}
