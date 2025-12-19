import { CheckoutPago } from "../../domain/models/checkout-pago";
import PasarelaPagoService from "../../domain/services/pasarela-pago-service";
import ParameterError from "../../infraestructure/sdk/error/parameter-error";
import ProcessError from "../../infraestructure/sdk/error/process-error";
import UnauthorizedError from "../../infraestructure/sdk/error/unauthorized-error";
import { isValidObject } from "../../infraestructure/sdk/utils/validator";
import { getTokenFromRequest, verifyAccessToken } from "../authorization/token";

export default class PasarelaPagoController {
  pasarelaPagoService: PasarelaPagoService;

  constructor(pasarelaPagoService: PasarelaPagoService) {
    this.pasarelaPagoService = pasarelaPagoService;
  }

  postCreateCheckout = (req, res, next) => {
    const token = getTokenFromRequest(req);
    const dataBody = { ...req.body };

    if (!token || !isValidObject(dataBody)) {
      next(new ParameterError("Error de parámetros"));
      return;
    }
    const dataToken = verifyAccessToken(token);
    if (!dataToken) {
      next(new UnauthorizedError("No se pudo obtener información del Token"));
      return;
    }

    let checkoutPago: CheckoutPago = null;
    try {
      checkoutPago = dataBody as CheckoutPago;
    } catch (error) {
      next(new ProcessError("Error procesando parámetros", error));
      return;
    }

    this.pasarelaPagoService
      .createCheckout(token, checkoutPago)
      .then((response) => res.send(response))
      .catch(next);
  };

  get = (req, res, next) => {
    const token = getTokenFromRequest(req);

    if (!token) {
      next(new ParameterError("Error de parámetros"));
      return;
    }
    const dataToken = verifyAccessToken(token);
    if (!dataToken) {
      next(new UnauthorizedError("No se pudo obtener información del Token"));
      return;
    }

    this.pasarelaPagoService
      .list(token)
      .then((response) => res.send(response))
      .catch(next);
  };
}
