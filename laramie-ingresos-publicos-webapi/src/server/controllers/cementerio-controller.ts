import CementerioDTO from '../../domain/dto/cementerio-dto';
import CementerioFilter from '../../domain/dto/cementerio-filter';
import CementerioService from '../../domain/services/cementerio-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';


export default class CementerioController {

  cementerioService: CementerioService;

  constructor(cementerioService: CementerioService) {
    this.cementerioService = cementerioService;
  }

  getByCuenta = (req, res, next) => {
    let cementerioFilter = new CementerioFilter();
    cementerioFilter.numeroCuenta = req.query.numeroCuenta;
    cementerioFilter.numeroWeb = req.query.numeroWeb;
    cementerioFilter.numeroDocumento = req.query.numeroDocumento;
    cementerioFilter.idPersona = req.query.idPersona;
    cementerioFilter.etiqueta = req.query.etiqueta;

    this.cementerioService.listByCuenta(cementerioFilter)
      .then(data => res.send(data))
      .catch(next)
  }

  getByDatos = (req, res, next) => {
    let cementerioFilter = new CementerioFilter();
    cementerioFilter.numeroDocumentoInhumado = req.query.numeroDocumentoInhumado;
    cementerioFilter.nombreApellidoInhumado = req.query.nombreApellidoInhumado;

    this.cementerioService.listByDatos(cementerioFilter)
      .then(data => res.send(data))
      .catch(next)
  }

  getById = (req, res, next) => {
    const id = req.params.id;
    this.cementerioService.findById(id)
      .then(row => res.send(row))
      .catch(next)
  }

  post = (req, res, next) => {
    const dataBody = {...req.body};
    const cementerioDTO = new CementerioDTO(); cementerioDTO.setFromObject(dataBody);
    this.cementerioService.add(cementerioDTO)
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
    const cementerioDTO = new CementerioDTO(); cementerioDTO.setFromObject(dataBody);
    this.cementerioService.modify(id, dataToken.idUsuario, cementerioDTO)
      .then(row => res.send(row))
      .catch(next)
  }
  
  delete = (req, res, next) => {
    const id = req.params.id;
    this.cementerioService.remove(id)
      .then(id => res.send(id))
      .catch(next)
  }

}
