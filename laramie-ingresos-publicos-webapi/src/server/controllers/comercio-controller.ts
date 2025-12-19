import ComercioDTO from '../../domain/dto/comercio-dto';
import ComercioFilter from '../../domain/dto/comercio-filter';
import ComercioService from '../../domain/services/comercio-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';


export default class ComercioController {

  comercioService: ComercioService;

  constructor(comercioService: ComercioService) {
    this.comercioService = comercioService;
  }

  getByCuenta = (req, res, next) => {
    let comercioFilter = new ComercioFilter();
    comercioFilter.numeroCuenta = req.query.numeroCuenta;
    comercioFilter.numeroWeb = req.query.numeroWeb;
    comercioFilter.numeroDocumento = req.query.numeroDocumento;
    comercioFilter.idPersona = req.query.idPersona;
    comercioFilter.etiqueta = req.query.etiqueta;

    this.comercioService.listByCuenta(comercioFilter)
      .then(data => res.send(data))
      .catch(next)
  }

  getByDatos = (req, res, next) => {
    let comercioFilter = new ComercioFilter();
    comercioFilter.cuentaInmueble = req.query.cuentaInmueble;
    comercioFilter.rubro = req.query.rubro;
    comercioFilter.nombreFantasia = req.query.nombreFantasia;

    this.comercioService.listByDatos(comercioFilter)
      .then(data => res.send(data))
      .catch(next)
  } 

  getById = (req, res, next) => {
    const id = req.params.id;
    this.comercioService.findById(id)
      .then(row => res.send(row))
      .catch(next)
  }

  post = (req, res, next) => {
    const dataBody = {...req.body};
    const comercioDTO = new ComercioDTO(); comercioDTO.setFromObject(dataBody);
    this.comercioService.add(comercioDTO)
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
    const comercioDTO = new ComercioDTO(); comercioDTO.setFromObject(dataBody);
    this.comercioService.modify(id, dataToken.idUsuario, comercioDTO)
      .then(row => res.send(row))
      .catch(next)
  }
  
  delete = (req, res, next) => {
    const id = req.params.id;
    this.comercioService.remove(id)
      .then(id => res.send(id))
      .catch(next)
  }

}
