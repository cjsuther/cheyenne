import InmuebleDTO from '../../domain/dto/inmueble-dto';
import InmuebleFilter from '../../domain/dto/inmueble-filter';
import InmuebleService from '../../domain/services/inmueble-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';


export default class InmuebleController {

  inmuebleService: InmuebleService;

  constructor(inmuebleService: InmuebleService) {
    this.inmuebleService = inmuebleService;
  }

  getByCuenta = (req, res, next) => {
    let inmuebleFilter = new InmuebleFilter();
    inmuebleFilter.numeroCuenta = req.query.numeroCuenta;
    inmuebleFilter.numeroWeb = req.query.numeroWeb;
    inmuebleFilter.numeroDocumento = req.query.numeroDocumento;
    inmuebleFilter.idPersona = req.query.idPersona;
    inmuebleFilter.etiqueta = req.query.etiqueta;

    this.inmuebleService.listByCuenta(inmuebleFilter)
      .then(data => res.send(data))
      .catch(next)
  }

  getByUbicacion = (req, res, next) => {
    let inmuebleFilter = new InmuebleFilter();
    inmuebleFilter.catastral = req.query.catastral;
    inmuebleFilter.direccion = req.query.direccion;

    this.inmuebleService.listByUbicacion(inmuebleFilter)
      .then(data => res.send(data))
      .catch(next)
  }

  getById = (req, res, next) => {
    const id = req.params.id;
    this.inmuebleService.findById(id)
      .then(row => res.send(row))
      .catch(next)
  }

  post = (req, res, next) => {
    const dataBody = {...req.body};
    const inmuebleDTO = new InmuebleDTO(); inmuebleDTO.setFromObject(dataBody);
    this.inmuebleService.add(inmuebleDTO)
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
    const inmuebleDTO = new InmuebleDTO(); inmuebleDTO.setFromObject(dataBody);
    this.inmuebleService.modify(id, dataToken.idUsuario, inmuebleDTO)
      .then(row => res.send(row))
      .catch(next)
  }
  
  delete = (req, res, next) => {
    const id = req.params.id;
    this.inmuebleService.remove(id)
      .then(id => res.send(id))
      .catch(next)
  }

}
