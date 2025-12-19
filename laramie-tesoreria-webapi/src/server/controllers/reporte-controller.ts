import ReporteService from '../../domain/services/reporte-service';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import { isValidDate } from '../../infraestructure/sdk/utils/validator';
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
		let paramsReporte = {...req.body};
		
		if (paramsReporte.filtros && paramsReporte.filtros.fechaDeudaAl) {
			if (!isValidDate(paramsReporte.filtros.fechaDeudaAl, true)) {
				next(new ValidationError('Parámetros incorrectos'));
				return;
			}
			try {
				paramsReporte.filtros.fechaDeudaAl = new Date(paramsReporte.filtros.fechaDeudaAl);
			}
			catch (error) {
				next(new ProcessError('Error procesando parámetros', error));
				return;
			}
		}

		this.reporteService.generateReport(token, dataToken.codigo, reporte, paramsReporte)
		.then((buffer) => {
			res.send(buffer);
		})
		.catch(next)
	}

}
