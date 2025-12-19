import CertificadoApremioDTO from '../../domain/dto/certificado-apremio-dto';
import CertificadoApremioFilter from '../../domain/dto/certificado-apremio-filter';
import CertificadoApremioService from '../../domain/services/certificado-apremio-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';

export default class CertificadoApremioController {

	certificadoApremioService: CertificadoApremioService;

	constructor(certificadoApremioService: CertificadoApremioService) {
		this.certificadoApremioService = certificadoApremioService;
	}

	get = (req, res, next) => {
		this.certificadoApremioService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getByFilter = (req, res, next) => {
		let certificadoApremioFilter = new CertificadoApremioFilter();
		certificadoApremioFilter.idApremio = parseInt(req.query.idApremio);
		certificadoApremioFilter.idCuenta = parseInt(req.query.idCuenta);
		certificadoApremioFilter.idEstadoCertificadoApremio = parseInt(req.query.idEstadoCertificadoApremio);
		certificadoApremioFilter.numero = req.query.numero;
		certificadoApremioFilter.fechaCertificadoDesde = (req.query.fechaCertificadoDesde.length > 0) ? new Date(req.query.fechaCertificadoDesde) : null;
		certificadoApremioFilter.fechaCertificadoHasta = (req.query.fechaCertificadoHasta.length > 0) ? new Date(req.query.fechaCertificadoHasta) : null;

		this.certificadoApremioService.listByFilter(certificadoApremioFilter)
			.then(data => res.send(data))
			.catch(next)
	}

	getByApremio = (req, res, next) => {
		const idApremio = req.params.idApremio
		this.certificadoApremioService.listByApremio(idApremio)
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.certificadoApremioService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const dataBody = {...req.body};
		const idCuenta = dataBody.idCuenta;
		const partidas = dataBody.partidas;
		this.certificadoApremioService.add(idCuenta, partidas)
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
		const certificadoApremioDTO = new CertificadoApremioDTO(); certificadoApremioDTO.setFromObject(dataBody);
		this.certificadoApremioService.modify(id, dataToken.idUsuario, certificadoApremioDTO )
			.then(row => res.send(row))
			.catch(next)
	}

	putCancel = (req, res, next) => {
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
		this.certificadoApremioService.modifyCancel(id, dataToken.idUsuario )
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.certificadoApremioService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
