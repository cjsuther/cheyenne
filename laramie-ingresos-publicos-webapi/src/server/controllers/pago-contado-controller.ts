import PagoContadoAdd from '../../domain/dto/pago-contado-add';
import PagoContadoService from '../../domain/services/pago-contado-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';

export default class PagoContadoController {

	pagoContadoService: PagoContadoService;

	constructor(pagoContadoService: PagoContadoService) {
		this.pagoContadoService = pagoContadoService;
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
		const pagoContado = new PagoContadoAdd(); pagoContado.setFromObject(dataBody);
		this.pagoContadoService.add(dataToken.idUsuario, pagoContado)
			.then(row => res.send(row))
			.catch(next)
	}

}
