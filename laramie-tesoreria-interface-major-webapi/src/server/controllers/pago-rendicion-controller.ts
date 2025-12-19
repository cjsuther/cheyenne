import PagoRendicionLote from "../../domain/entities/pago-rendicion-lote";
import PagoRendicionService from "../../domain/services/pago-rendicion-service";
import UnauthorizedError from "../../infraestructure/sdk/error/unauthorized-error";
import ValidationError from "../../infraestructure/sdk/error/validation-error";
import { getTokenFromRequest, verifyAccessToken } from "../authorization/token";

export default class PagoRendicionController {

  pagoRendicionService: PagoRendicionService;

  constructor(pagoRendicionService: PagoRendicionService) {
    this.pagoRendicionService = pagoRendicionService;
  }

  putImport = (req, res, next) => {
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

    this.pagoRendicionService.modifyImport(token, dataToken.idUsuario)
      .then(data => res.send(data))
      .catch(next)
  }

  putSend = (req, res, next) => {
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

    this.pagoRendicionService.modifySend(token, dataToken.idUsuario)
      .then(data => res.send(data))
      .catch(next)
  }

}
