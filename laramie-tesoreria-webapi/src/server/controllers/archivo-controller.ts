import ProcessError from '../../infraestructure/sdk/error/process-error';
import Archivo from '../../domain/entities/archivo';
import ArchivoService from '../../domain/services/archivo-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';

export default class ArchivoController {

	archivoService: ArchivoService;

	constructor(archivoService: ArchivoService) {
		this.archivoService = archivoService;
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
		const archivo = new Archivo();
		try {
			archivo.setFromObject(dataBody);
		}
		catch (error) {
			next(new ProcessError('Error procesando parámetros', error));
			return;
		}
		this.archivoService.add(dataToken.idUsuario, archivo)
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
