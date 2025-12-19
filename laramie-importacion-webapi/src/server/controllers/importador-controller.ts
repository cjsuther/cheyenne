import ImportadorService from '../../domain/services/importador-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';

export default class ImportadorController {

	importadorService: ImportadorService;

	constructor(importadorService: ImportadorService) {
		this.importadorService = importadorService;
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

		const tipo = req.params.tipo;
		const paramsImportador = {...req.body};
		this.importadorService.import(dataToken.idUsuario, tipo, paramsImportador)
			.then(row => res.send(row))
			.catch(next)
	}

}
