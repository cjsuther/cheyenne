import CertificadoApremioItemService from '../../domain/services/certificado-apremio-item-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber, isValidObject } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class CertificadoApremioItemController {

	certificadoApremioItemService: CertificadoApremioItemService;

	constructor(certificadoApremioItemService: CertificadoApremioItemService) {
		this.certificadoApremioItemService = certificadoApremioItemService;
	}

	get = (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.certificadoApremioItemService.list(token)
			.then(data => res.send(data))
			.catch(next)
	}

	getByCertificadoApremio = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idCertificadoApremio = req.params.idCertificadoApremio;
		if (!token || !isValidNumber(idCertificadoApremio, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		
		this.certificadoApremioItemService.listByCertificadoApremio(token, idCertificadoApremio)
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
		
		this.certificadoApremioItemService.findById(token, id)
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

		this.certificadoApremioItemService.add(token, dataBody)
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

		this.certificadoApremioItemService.modify(token, id, dataBody)
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

		this.certificadoApremioItemService.remove(token, id)
			.then(id => res.send(id))
			.catch(next)
	}

}
