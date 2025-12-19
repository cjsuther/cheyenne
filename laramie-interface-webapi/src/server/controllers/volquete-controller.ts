import ConsultaRequest from '../../domain/dto/consulta-request';
import SolicitudRequest from '../../domain/dto/solicitud-request';
import CuentaPagoService from '../../domain/services/cuenta-pago-service';
import ReporteService from '../../domain/services/reporte-service';
import VolqueteService from '../../domain/services/volquete-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { isValidNumber } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';


export default class VolqueteController {

  volqueteService: VolqueteService;
  cuentaPagoService: CuentaPagoService;
  reporteService: ReporteService;

  constructor(volqueteService: VolqueteService, cuentaPagoService: CuentaPagoService, reporteService: ReporteService) {
    this.volqueteService = volqueteService;
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
		if (!token) {
			next(new UnauthorizedError('Token inválido'));
			return;
		}
		const idCuentaPago = req.params.idCuentaPago;
		if (!isValidNumber(idCuentaPago, true)) {
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

		this.volqueteService.list(token, consultaRequest)
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

		this.volqueteService.add(token, dataToken.idUsuario, solicitudRequest)
			.then(data => res.send(data))
			.catch(next)
  }

}
