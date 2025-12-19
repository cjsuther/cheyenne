import ReciboPublicacionService from "../../domain/services/recibo-publicacion-service";
import ParameterError from "../../infraestructure/sdk/error/parameter-error";
import UnauthorizedError from "../../infraestructure/sdk/error/unauthorized-error";
import { isValidString } from "../../infraestructure/sdk/utils/validator";
import { getTokenFromRequest, verifyAccessToken } from "../authorization/token";

export default class PagoRendicionController {

  reciboPublicacionService: ReciboPublicacionService;

  constructor(reciboPublicacionService: ReciboPublicacionService) {
    this.reciboPublicacionService = reciboPublicacionService;
  }

  putExport = (req, res, next) => {
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

	const modo = req.params.modo;
	if (!token || !isValidString(modo, true)) {
		next(new ParameterError('Error de parámetros'));
		return;
	}

	this.reciboPublicacionService.modifyExport(token, dataToken.idUsuario, modo)
		.then(result => res.send(result))
		.catch(next)
  }

  putConfirmacion = (req, res, next) => {
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

	const numeroLotePublicacion = req.params.numeroLotePublicacion;
	if (!token || !isValidString(numeroLotePublicacion, true)) {
		next(new ParameterError('Error de parámetros'));
		return;
	}

    this.reciboPublicacionService.modifyConfirmacion(token, dataToken.idUsuario, numeroLotePublicacion)
      .then(data => res.send(data))
      .catch(next)
  }

}
