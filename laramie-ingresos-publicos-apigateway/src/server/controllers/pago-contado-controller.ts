import PagoContadoService from '../../domain/services/pago-contado-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber, isValidObject } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class PagoContadoController {

	pagoContadoService: PagoContadoService;

	constructor(pagoContadoService: PagoContadoService) {
		this.pagoContadoService = pagoContadoService;
	}

	post = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const dataBody = {...req.body};
		if (!token || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.pagoContadoService.add(token, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

}
