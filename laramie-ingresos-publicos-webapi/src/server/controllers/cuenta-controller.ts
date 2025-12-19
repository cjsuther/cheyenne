import CuentaFilter from '../../domain/dto/cuenta-filter';
import Cuenta from '../../domain/entities/cuenta';
import CuentaService from '../../domain/services/cuenta-service';


export default class CuentaController {

  cuentaService: CuentaService;

  constructor(cuentaService: CuentaService) {
    this.cuentaService = cuentaService;
  }

  get = (req, res, next) => {
    this.cuentaService.list()
      .then(data => res.send(data))
      .catch(next)
  }

  getByFilter = (req, res, next) => {
    let cuentaFilter = new CuentaFilter();
    cuentaFilter.idCuenta = req.query.idCuenta;
    cuentaFilter.idTipoTributo = req.query.idTipoTributo;
    cuentaFilter.numeroCuenta = req.query.numeroCuenta;
    cuentaFilter.numeroWeb = req.query.numeroWeb;
    cuentaFilter.idPersona = req.query.idPersona;
    cuentaFilter.etiqueta = req.query.etiqueta;

    this.cuentaService.listByFilter(cuentaFilter)
      .then(data => res.send(data))
      .catch(next)
  }

  getByPersona = (req, res, next) => {
    const idPersona = req.params.idPersona;
    this.cuentaService.listByPersona(idPersona)
      .then(data => res.send(data))
      .catch(next)
  }

  getById = (req, res, next) => {
    const id = req.params.id;
    this.cuentaService.findById(id)
      .then(row => res.send(row))
      .catch(next)
  }

  getByContribuyente = (req, res, next) => {
    const idContribuyente = req.params.idContribuyente;
    this.cuentaService.listByContribuyente(idContribuyente)
      .then(data => res.send(data))
      .catch(next)
  }

  getDataById = (req, res, next) => {
    const id = req.params.id;
    this.cuentaService.findDataById(id)
      .then(row => res.send(row))
      .catch(next)
  }

  putBajaById = (req, res, next) => {
    const id = parseInt(req.params.id);
    this.cuentaService.modifyBajaById(id)
      .then(row => res.send(row))
      .catch(next)
  }

}
