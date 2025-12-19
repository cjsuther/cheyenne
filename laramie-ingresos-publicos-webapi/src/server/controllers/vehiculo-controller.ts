import VehiculoDTO from '../../domain/dto/vehiculo-dto';
import VehiculoFilter from '../../domain/dto/vehiculo-filter';
import VehiculoService from '../../domain/services/vehiculo-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';


export default class VehiculoController {

  vehiculoService: VehiculoService;

  constructor(vehiculoService: VehiculoService) {
    this.vehiculoService = vehiculoService;
  }

  getByCuenta = (req, res, next) => {
    let vehiculoFilter = new VehiculoFilter();
    vehiculoFilter.numeroCuenta = req.query.numeroCuenta;
    vehiculoFilter.numeroWeb = req.query.numeroWeb;
    vehiculoFilter.numeroDocumento = req.query.numeroDocumento;
    vehiculoFilter.idPersona = req.query.idPersona;
    vehiculoFilter.etiqueta = req.query.etiqueta;

    this.vehiculoService.listByCuenta(vehiculoFilter)
      .then(data => res.send(data))
      .catch(next)
  }

  getByDatos = (req, res, next) => {
    let vehiculoFilter = new VehiculoFilter();
    vehiculoFilter.dominio = req.query.dominio;
    vehiculoFilter.marcaModelo = req.query.marcaModelo;

    this.vehiculoService.listByDatos(vehiculoFilter)
      .then(data => res.send(data))
      .catch(next)
  }  

  getById = (req, res, next) => {
    const id = req.params.id;
    this.vehiculoService.findById(id)
      .then(row => res.send(row))
      .catch(next)
  }

  post = (req, res, next) => {
    const dataBody = {...req.body};
    const vehiculoDTO = new VehiculoDTO(); vehiculoDTO.setFromObject(dataBody);
    this.vehiculoService.add(vehiculoDTO)
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
    const vehiculoDTO = new VehiculoDTO(); vehiculoDTO.setFromObject(dataBody);
    this.vehiculoService.modify(id, dataToken.idUsuario, vehiculoDTO)
      .then(row => res.send(row))
      .catch(next)
  }
  
  delete = (req, res, next) => {
    const id = req.params.id;
    this.vehiculoService.remove(id)
      .then(id => res.send(id))
      .catch(next)
  }

}
