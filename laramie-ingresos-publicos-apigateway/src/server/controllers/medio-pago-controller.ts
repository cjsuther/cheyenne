import MedioPagoService from '../../domain/services/medio-pago-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class MedioPagoController {

  medioPagoService: MedioPagoService;

  constructor(medioPagoService: MedioPagoService) {
    this.medioPagoService = medioPagoService;
  }

	getByCuenta = (req, res, next) => {
		const token = getTokenFromRequest(req);
    let idCuenta = req.params.idCuenta;
		if (!token || !isValidNumber(idCuenta, false)) {
		  next(new ParameterError('Error de parámetros'));
		  return;
		}
    idCuenta = parseInt(idCuenta);
	
		this.medioPagoService.listByCuenta(token, idCuenta)
		  .then(data => res.send(data))
		  .catch(next)
	}

  getById = (req, res, next) => {
    const token = getTokenFromRequest(req);
    const id = req.params.id;
    if (!token || !isValidNumber(id, true)) {
      next(new ParameterError('Error de parámetros'));
      return;
    }
    
    this.medioPagoService.findById(token, id)
      .then(row => res.send(row))
      .catch(next)
  }

}
