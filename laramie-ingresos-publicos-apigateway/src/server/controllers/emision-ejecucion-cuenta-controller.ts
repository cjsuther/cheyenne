import EmisionEjecucionCuentaService from '../../domain/services/emision-ejecucion-cuenta-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class EmisionEjecucionCuentaController {

	emisionEjecucionCuentaService: EmisionEjecucionCuentaService;

	constructor(emisionEjecucionCuentaService: EmisionEjecucionCuentaService) {
		this.emisionEjecucionCuentaService = emisionEjecucionCuentaService;
	}

	getResume = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idEmisionEjecucion = req.params.idEmisionEjecucion;
		if (!token || !isValidNumber(idEmisionEjecucion, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		
		this.emisionEjecucionCuentaService.listResume(token, idEmisionEjecucion)
			.then(row => res.send(row))
			.catch(next)
	}

	getByNumero = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idEmisionEjecucion = req.params.idEmisionEjecucion;
		const numero = req.params.numero;
		if (!token || !isValidNumber(idEmisionEjecucion, true) || !isValidNumber(numero, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.emisionEjecucionCuentaService.findByNumero(token, idEmisionEjecucion, numero)
			.then(row => res.send(row))
			.catch(next)
	}

	getByCuenta = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idEmisionEjecucion = req.params.idEmisionEjecucion;
		const idCuenta = req.params.idCuenta;
		if (!token || !isValidNumber(idEmisionEjecucion, true) || !isValidNumber(idCuenta, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.emisionEjecucionCuentaService.findByCuenta(token, idEmisionEjecucion, idCuenta)
			.then(row => res.send(row))
			.catch(next)
	}

}
