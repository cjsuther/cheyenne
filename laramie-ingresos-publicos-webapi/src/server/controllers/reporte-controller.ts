import ReporteService from '../../domain/services/reporte-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';

export default class ReporteController {

	reporteService: ReporteService;

	constructor(reporteService: ReporteService) {
		this.reporteService = reporteService;
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

		const reporte = req.params.reporte;
		const paramsReporte = {...req.body};
		this.reporteService.generateReport(dataToken.codigo, reporte, paramsReporte)
		.then((buffer) => {
			res.send(buffer);
		})
		.catch(next)
	}

}
