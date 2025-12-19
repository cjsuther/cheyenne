import ExportadorService from '../../domain/services/exportador-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';

export default class ExportadorController {

	exportadorService: ExportadorService;

	constructor(exportadorService: ExportadorService) {
		this.exportadorService = exportadorService;
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
		const paramsExportador = {...req.body};
		this.exportadorService.export(dataToken.idUsuario, tipo, paramsExportador)
			.then(buffer => res.send(buffer))
			.catch(next)
	}

}
