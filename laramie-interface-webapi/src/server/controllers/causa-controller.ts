import ConsultaRequest from '../../domain/dto/consulta-request';
import SolicitudRequest from '../../domain/dto/solicitud-request';
import ReporteService from '../../domain/services/reporte-service';
import CausaService from '../../domain/services/causa-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { isValidNumber } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';
import CuentaPagoService from '../../domain/services/cuenta-pago-service';


export default class CausaController {

  causaService: CausaService;
  cuentaPagoService: CuentaPagoService;
  reporteService: ReporteService;

	constructor(causaService: CausaService, cuentaPagoService: CuentaPagoService, reporteService: ReporteService) {
		this.causaService = causaService;
		this.cuentaPagoService = cuentaPagoService;
		this.reporteService = reporteService;
	}

  	get = (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new UnauthorizedError('Token inválido'));
			return;
		}
		const idCuentaPago = req.params.idCuentaPago;
		if (!isValidNumber(idCuentaPago, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		const dataBody = {
			idCuentaPago: idCuentaPago,
			reciboResumido: false
		}

		this.reporteService.generateReport(token, 'CuentaCorrienteRecibo', dataBody)
			.then(data => res.send(data))
			.catch(next)
  	}

	getDetalle = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idCuentaPago = req.params.idCuentaPago;
		if (!token || !isValidNumber(idCuentaPago, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.cuentaPagoService.findById(token, idCuentaPago)
			.then(data => res.send(data))
			.catch(next)
	}

  	put = (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new UnauthorizedError('Token inválido'));
			return;
		}

		const dataBody = {...req.body};
		const consultaRequest = new ConsultaRequest();
		try {
			consultaRequest.setFromObject(dataBody);
		}
		catch (error) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.causaService.list(token, consultaRequest)
			.then(data => res.send(data))
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
		const solicitudRequest = new SolicitudRequest();
		try {
			solicitudRequest.setFromObject(dataBody);
		}
		catch (error) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.causaService.add(token, dataToken.idUsuario, solicitudRequest)
			.then(data => res.send(data))
			.catch(next)
  	}

}
