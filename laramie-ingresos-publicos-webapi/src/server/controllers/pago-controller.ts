import PagoService from '../../domain/services/pago-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';

export default class PagoController {

	pagoService: PagoService;

	constructor(pagoService: PagoService) {
		this.pagoService = pagoService;
	}

	putPagoAnticipado = (req, res, next) => {
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

		const id = req.params.id;
		this.pagoService.modifyPagoAnticipado(dataToken.idUsuario, id)
			.then(row => res.send(row))
			.catch(next)
	}

}
