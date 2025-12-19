import EspecialDTO from '../../domain/dto/especial-dto';
import EspecialFilter from '../../domain/dto/especial-filter';
import EspecialService from '../../domain/services/especial-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';


export default class EspecialController {

  especialService: EspecialService;

  constructor(especialService: EspecialService) {
    this.especialService = especialService;
  }

  getByCuenta = (req, res, next) => {
    let especialFilter = new EspecialFilter();
    especialFilter.numeroCuenta = req.query.numeroCuenta;
    especialFilter.numeroWeb = req.query.numeroWeb;
    especialFilter.numeroDocumento = req.query.numeroDocumento;
    especialFilter.idPersona = req.query.idPersona;
    especialFilter.etiqueta = req.query.etiqueta;

    this.especialService.listByCuenta(especialFilter)
      .then(data => res.send(data))
      .catch(next)
  }

  getById = (req, res, next) => {
    const id = req.params.id;
    this.especialService.findById(id)
      .then(row => res.send(row))
      .catch(next)
  }

  post = (req, res, next) => {
    const dataBody = {...req.body};
    const especialDTO = new EspecialDTO(); especialDTO.setFromObject(dataBody);
    this.especialService.add(especialDTO)
      .then(row => res.send(row))
      .catch(next)
  }

  put = (req, res, next) => {
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
    const dataBody = {...req.body};
    const especialDTO = new EspecialDTO(); especialDTO.setFromObject(dataBody);
    this.especialService.modify(id, dataToken.idUsuario, especialDTO)
      .then(row => res.send(row))
      .catch(next)
  }
  
  delete = (req, res, next) => {
    const id = req.params.id;
    this.especialService.remove(id)
      .then(id => res.send(id))
      .catch(next)
  }

}
