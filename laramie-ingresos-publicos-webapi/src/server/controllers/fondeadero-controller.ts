import FondeaderoDTO from '../../domain/dto/fondeadero-dto';
import FondeaderoFilter from '../../domain/dto/fondeadero-filter';
import FondeaderoService from '../../domain/services/fondeadero-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';


export default class FondeaderoController {

  fondeaderoService: FondeaderoService;

  constructor(fondeaderoService: FondeaderoService) {
    this.fondeaderoService = fondeaderoService;
  }

  getByCuenta = (req, res, next) => {
    let fondeaderoFilter = new FondeaderoFilter();
    fondeaderoFilter.numeroCuenta = req.query.numeroCuenta;
    fondeaderoFilter.numeroWeb = req.query.numeroWeb;
    fondeaderoFilter.numeroDocumento = req.query.numeroDocumento;
    fondeaderoFilter.idPersona = req.query.idPersona;
    fondeaderoFilter.etiqueta = req.query.etiqueta;

    this.fondeaderoService.listByCuenta(fondeaderoFilter)
      .then(data => res.send(data))
      .catch(next)
  }

  getByDatos = (req, res, next) => {
    let fondeaderoFilter = new FondeaderoFilter();
    fondeaderoFilter.idTasa = req.query.idTasa;
    fondeaderoFilter.idSubTasa = req.query.idSubTasa;
    fondeaderoFilter.embarcacion = req.query.embarcacion;

    this.fondeaderoService.listByDatos(fondeaderoFilter)
      .then(data => res.send(data))
      .catch(next)
  }  

  getById = (req, res, next) => {
    const id = req.params.id;
    this.fondeaderoService.findById(id)
      .then(row => res.send(row))
      .catch(next)
  }

  post = (req, res, next) => {
    const dataBody = {...req.body};
    const fondeaderoDTO = new FondeaderoDTO(); fondeaderoDTO.setFromObject(dataBody);
    this.fondeaderoService.add(fondeaderoDTO)
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
    const fondeaderoDTO = new FondeaderoDTO(); fondeaderoDTO.setFromObject(dataBody);
    this.fondeaderoService.modify(id, dataToken.idUsuario, fondeaderoDTO)
      .then(row => res.send(row))
      .catch(next)
  }
  
  delete = (req, res, next) => {
    const id = req.params.id;
    this.fondeaderoService.remove(id)
      .then(id => res.send(id))
      .catch(next)
  }

}
