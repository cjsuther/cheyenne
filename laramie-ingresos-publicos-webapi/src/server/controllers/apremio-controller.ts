import ApremioDTO from '../../domain/dto/apremio-dto';
import ApremioFilter from '../../domain/dto/apremio-filter';
import ApremioService from '../../domain/services/apremio-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';

export default class ApremioController {

	apremioService: ApremioService;

	constructor(apremioService: ApremioService) {
		this.apremioService = apremioService;
	}

	get = (req, res, next) => {
		this.apremioService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getByFilter = (req, res, next) => {
		let apremioFilter = new ApremioFilter();
		apremioFilter.numero = req.query.numero;
		apremioFilter.caratula = req.query.caratula;
		apremioFilter.idExpediente = parseInt(req.query.idExpediente);
		apremioFilter.idOrganismoJudicial = parseInt(req.query.idOrganismoJudicial);
		apremioFilter.fechaInicioDemandaDesde = (req.query.fechaInicioDemandaDesde.length > 0) ? new Date(req.query.fechaInicioDemandaDesde) : null;
		apremioFilter.fechaInicioDemandaHasta = (req.query.fechaInicioDemandaHasta.length > 0) ? new Date(req.query.fechaInicioDemandaHasta) : null;

		this.apremioService.listByFilter(apremioFilter)
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.apremioService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new UnauthorizedError('Token inválido'));
			return;
		}
		const dataToken = verifyAccessToken(token);
		if (!dataToken) {
			next(new UnauthorizedError('No se pudo obtener información del Token'));
			return;
		}

		const idCertificadoApremio = req.params.idCertificadoApremio;
		const dataBody = {...req.body};
		const apremioDTO = new ApremioDTO(); apremioDTO.setFromObject(dataBody);
		this.apremioService.add(idCertificadoApremio, dataToken.idUsuario, apremioDTO)
			.then(row => res.send(row))
			.catch(next)
	}
	put = (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new UnauthorizedError('Token inválido'));
			return;
		}
		const dataToken = verifyAccessToken(token);
		if (!dataToken) {
			next(new UnauthorizedError('No se pudo obtener información del Token'));
			return;
		}

		const id = req.params.id;
		const dataBody = {...req.body};
		const apremioDTO = new ApremioDTO(); apremioDTO.setFromObject(dataBody);
		this.apremioService.modify(id, dataToken.idUsuario, apremioDTO )
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.apremioService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
