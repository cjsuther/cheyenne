import ComercioService from '../../domain/services/comercio-service';
import CuentaService from '../../domain/services/cuenta-service';
import ReporteService from '../../domain/services/reporte-service';
import RetencionService from '../../domain/services/retencion-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber, isValidString } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class CuentaController {

  cuentaService: CuentaService;
  comercioService: ComercioService;
  retencionService: RetencionService;
  reporteService: ReporteService;

  constructor(cuentaService: CuentaService,
              comercioService: ComercioService,
              retencionService: RetencionService,
              reporteService: ReporteService) {
    this.cuentaService = cuentaService;
    this.comercioService = comercioService;
    this.retencionService = retencionService;
    this.reporteService = reporteService;
  }

  getByNumero = (req, res, next) => {
    const token = getTokenFromRequest(req);
    const idTipoTributo = req.params.idTipoTributo;
    const numeroCuenta = req.params.numeroCuenta;
    const numeroWeb = req.params.numeroWeb;
    if (!token || !isValidNumber(idTipoTributo, true) || !isValidString(numeroCuenta, true) || !isValidString(numeroWeb, true)) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.cuentaService.listByNumero(token, idTipoTributo, numeroCuenta, numeroWeb)
      .then(data => res.send(data))
      .catch(next)
  }

  getByPersona = (req, res, next) => {
    const token = getTokenFromRequest(req);
    const idPersona = req.params.idPersona;
    if (!token || !isValidNumber(idPersona, true)) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.cuentaService.listByPersona(token, idPersona)
      .then(data => res.send(data))
      .catch(next)
  }

  getByComercio = (req, res, next) => {
    const token = getTokenFromRequest(req);
    const idComercio = req.params.idComercio;
    if (!token || !isValidNumber(idComercio, true)) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.comercioService.findById(token, idComercio)
      .then(data => res.send(data))
      .catch(next)
  }

  getRetencionAlicuota = (req, res, next) => {
    const token = getTokenFromRequest(req);
    if (!token) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.retencionService.listRetencionAlicuota(token)
      .then(data => res.send(data))
      .catch(next)
  }

  getRetencionAlicuotaCSV = (req, res, next) => {
    const token = getTokenFromRequest(req);
    const idRetencionAlicuota = req.params.idRetencionAlicuota;
    if (!token || !isValidNumber(idRetencionAlicuota, true)) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    const dataBody = {
      idRetencionAlicuota: idRetencionAlicuota
    }

    this.reporteService.generateReport(token, 'RetencionAlicuota', dataBody)
      .then(data => res.send(data))
      .catch(next)
  }

}
