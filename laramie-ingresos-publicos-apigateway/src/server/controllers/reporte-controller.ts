import ContribuyenteService from '../../domain/services/contribuyente-service';
import ReporteService from '../../domain/services/reporte-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidObject } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';

export default class ReporteController {

	reporteService: ReporteService;

	constructor(reporteService: ReporteService) {
		this.reporteService = reporteService;
	}

	put = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const reporte = req.params.reporte;
		const dataBody = {...req.body};
		if (!token || reporte.length === 0 || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		const result = this.reporteService.generateReport(token, reporte, dataBody)
		result.then(buffer => {
			res.send(buffer);
		})
		.catch(next)
	}

}
