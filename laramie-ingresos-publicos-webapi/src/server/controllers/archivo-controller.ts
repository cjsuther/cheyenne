import Archivo from '../../domain/entities/archivo';
import ArchivoService from '../../domain/services/archivo-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';

export default class ArchivoController {

	archivoService: ArchivoService;

	constructor(archivoService: ArchivoService) {
		this.archivoService = archivoService;
	}

	get = (req, res, next) => {
		this.archivoService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getByEntidad = (req, res, next) => {
		const entidad = req.params.entidad;
		const idEntidad = req.params.idEntidad;
		this.archivoService.listByEntidad(entidad, idEntidad)
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.archivoService.findById(id)
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
		const archivo = new Archivo(); archivo.setFromObject(dataBody);
		this.archivoService.add(dataToken.idUsuario, archivo)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const archivo = new Archivo(); archivo.setFromObject(dataBody);
		this.archivoService.modify(id, archivo)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.archivoService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
