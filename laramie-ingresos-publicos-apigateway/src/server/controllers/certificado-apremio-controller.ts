import CertificadoApremioService from '../../domain/services/certificado-apremio-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber, isValidObject, isValidDate, isValidArray, isEmpty } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class CertificadoApremioController {

	certificadoApremioService: CertificadoApremioService;

	constructor(certificadoApremioService: CertificadoApremioService) {
		this.certificadoApremioService = certificadoApremioService;
	}

	get = (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.certificadoApremioService.list(token)
			.then(data => res.send(data))
			.catch(next)
	}

	getByFilter = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idApremio = req.query.idApremio;
		const idCuenta = req.query.idCuenta;
		const idEstadoCertificadoApremio = req.query.idEstadoCertificadoApremio;
		const numero = req.query.numero;
		const fechaCertificadoDesde = req.query.fechaCertificadoDesde;
		const fechaCertificadoHasta = req.query.fechaCertificadoHasta;

		if (!token || !isValidNumber(idApremio, false) || !isValidNumber(idCuenta, false) || !isValidNumber(idEstadoCertificadoApremio, false)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		if (!isEmpty(fechaCertificadoDesde) && !isValidDate(fechaCertificadoDesde)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		if (!isEmpty(fechaCertificadoHasta) && !isValidDate(fechaCertificadoHasta)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.certificadoApremioService.listByFilter(token, idApremio, idCuenta, idEstadoCertificadoApremio, numero, fechaCertificadoDesde, fechaCertificadoHasta)
		  .then(data => res.send(data))
		  .catch(next)
	}

	getByApremio = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idApremio = req.params.idApremio;
		this.certificadoApremioService.listByApremio(token, idApremio)
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
		
		this.certificadoApremioService.findById(token, id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const dataBody = {...req.body};
		if ( !isValidObject(dataBody) || !isValidArray(dataBody.partidas)) {
			next(new ParameterError('Error de parámetros'));
			return;
		  }

		this.certificadoApremioService.add(token, dataBody)
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

		this.certificadoApremioService.modify(token, id, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	putCancel = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		if (!token || !isValidNumber(id, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.certificadoApremioService.modifyCancel(token, id)
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

		this.certificadoApremioService.remove(token, id)
			.then(id => res.send(id))
			.catch(next)
	}

}
