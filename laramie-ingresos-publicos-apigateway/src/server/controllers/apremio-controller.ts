import ApremioService from '../../domain/services/apremio-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isEmpty, isValidDate, isValidNumber, isValidObject } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class ApremioController {

	apremioService: ApremioService;

	constructor(apremioService: ApremioService) {
		this.apremioService = apremioService;
	}

	get = (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.apremioService.list(token)
			.then(data => res.send(data))
			.catch(next)
	}

	getByFilter = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const numero = req.query.numero;
		const caratula = req.query.caratula;
		const idExpediente = req.query.idExpediente;
		const idOrganismoJudicial = req.query.idOrganismoJudicial;
		const fechaInicioDemandaDesde = req.query.fechaInicioDemandaDesde;
		const fechaInicioDemandaHasta = req.query.fechaInicioDemandaHasta;

		if (!token || !isValidNumber(idExpediente, false) || !isValidNumber(idOrganismoJudicial, false)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		if (!isEmpty(fechaInicioDemandaDesde) && !isValidDate(fechaInicioDemandaDesde)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		if (!isEmpty(fechaInicioDemandaHasta) && !isValidDate(fechaInicioDemandaHasta)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
	
		this.apremioService.listByFilter(token, numero, caratula, idExpediente, idOrganismoJudicial, fechaInicioDemandaDesde, fechaInicioDemandaHasta)
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
		
		this.apremioService.findById(token, id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idCertificadoApremio = req.params.idCertificadoApremio;
		const dataBody = {...req.body};
		if (!token || !isValidNumber(idCertificadoApremio, true) || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.apremioService.add(token, idCertificadoApremio, dataBody)
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

		this.apremioService.modify(token, id, dataBody)
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

		this.apremioService.remove(token, id)
			.then(id => res.send(id))
			.catch(next)
	}

}
