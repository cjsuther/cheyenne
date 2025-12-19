import ReporteService from '../../domain/services/reporte-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber, isValidString } from '../../infraestructure/sdk/utils/validator';


export default class BoletaController {

  reporteService: ReporteService;

	constructor(reporteService: ReporteService) {
		this.reporteService = reporteService;
	}

  	get = (req, res, next) => {
		const identificador = req.params.identificador;
		if (!isValidString(identificador, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.reporteService.generateReportIndentificador(identificador, 'EmisionReciboBoleta')
			.then(data => {
				res.setHeader('Content-Type', 'application/pdf');
				res.setHeader('Content-Disposition', `inline; filename="boleta.pdf"`);
				res.send(data);
			})
			.catch(next)
  	}

}
