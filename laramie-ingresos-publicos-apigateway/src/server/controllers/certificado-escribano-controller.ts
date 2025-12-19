import CertificadoEscribanoService from '../../domain/services/certificado-escribano-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber, isValidObject } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class CertificadoEscribanoController {

	certificadoEscribanoService: CertificadoEscribanoService;

	constructor(certificadoEscribanoService: CertificadoEscribanoService) {
		this.certificadoEscribanoService = certificadoEscribanoService;
	}

	get = (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.certificadoEscribanoService.list(token)
			.then(data => res.send(data))
			.catch(next)
	}

	getByFilter = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const anioCertificado = req.query.anioCertificado;
		const numeroCertificado = req.query.numeroCertificado;
		const idTipoCertificado = req.query.idTipoCertificado;
		const idEscribano = req.query.idEscribano;
		const idCuenta = req.query.idCuenta;
		const etiqueta = req.query.etiqueta;
		if (!token || !isValidNumber(idTipoCertificado, false) || !isValidNumber(idEscribano, false) || !isValidNumber(idCuenta, false)) {
		  next(new ParameterError('Error de parámetros'));
		  return;
		}
	
		this.certificadoEscribanoService.listByFilter(token, anioCertificado, numeroCertificado, idTipoCertificado, idEscribano, idCuenta, etiqueta)
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
		
		this.certificadoEscribanoService.findById(token, id)
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

		this.certificadoEscribanoService.add(token, dataBody)
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

		this.certificadoEscribanoService.modify(token, id, dataBody)
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

		this.certificadoEscribanoService.remove(token, id)
			.then(id => res.send(id))
			.catch(next)
	}

}
