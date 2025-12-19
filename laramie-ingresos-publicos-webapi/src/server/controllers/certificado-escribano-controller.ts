import CertificadoEscribanoDTO from '../../domain/dto/certificado-escribano-dto';
import CertificadoEscribanoFilter from '../../domain/dto/certificado-escribano-filter';
import CertificadoEscribano from '../../domain/entities/certificado-escribano';
import CertificadoEscribanoService from '../../domain/services/certificado-escribano-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';

export default class CertificadoEscribanoController {

	certificadoEscribanoService: CertificadoEscribanoService;

	constructor(certificadoEscribanoService: CertificadoEscribanoService) {
		this.certificadoEscribanoService = certificadoEscribanoService;
	}

	get = (req, res, next) => {
		this.certificadoEscribanoService.list()
			.then(data => res.send(data))
			.catch(next)
	}
	
	getByFilter = (req, res, next) => {
		let certificadoEscribanoFilter = new CertificadoEscribanoFilter();
		certificadoEscribanoFilter.anioCertificado = req.query.anioCertificado;
		certificadoEscribanoFilter.numeroCertificado = req.query.numeroCertificado;
		certificadoEscribanoFilter.idTipoCertificado = parseInt(req.query.idTipoCertificado);
		certificadoEscribanoFilter.idEscribano = parseInt(req.query.idEscribano);
		certificadoEscribanoFilter.idCuenta = parseInt(req.query.idCuenta);
		certificadoEscribanoFilter.etiqueta = req.query.etiqueta;
		
		this.certificadoEscribanoService.listByFilter(certificadoEscribanoFilter)
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.certificadoEscribanoService.findById(id)
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

		const dataBody = {...req.body};
		const certificadoEscribanoDTO = new CertificadoEscribanoDTO(); certificadoEscribanoDTO.setFromObject(dataBody);
		this.certificadoEscribanoService.add(dataToken.idUsuario, certificadoEscribanoDTO)
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
		const certificadoEscribanoDTO = new CertificadoEscribanoDTO(); certificadoEscribanoDTO.setFromObject(dataBody);
		this.certificadoEscribanoService.modify(id, dataToken.idUsuario, certificadoEscribanoDTO)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.certificadoEscribanoService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
