import { REQUEST_METHOD } from '../../infraestructure/sdk/consts/requestMethodType';
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import SolicitudRequest from '../dto/solicitud-request';
import { castPublicError, getDateNow, getDateSerialize } from '../../infraestructure/sdk/utils/convert';
import PublishService from './publish-service';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import PagoReciboEspecial from '../dto/pago-recibo-especial';
import PersonaService from './persona-service';
import ApiError from '../../infraestructure/sdk/error/api-error';
import ConsultaRequest from '../dto/consulta-request';
import ListaService from './lista-service';
import CuentaCorrienteItemResumen from '../entities/cuenta-corriente-item-resumen';
import CuentaCorrienteItemDeuda from '../entities/cuenta-corriente-item-deuda';
import EspecialDTO from '../dto/especial-dto';
import VinculoEspecialState from '../dto/vinculo-especial-state';
import Persona from '../entities/persona';
import { TRIBUTO_TYPE } from '../../infraestructure/sdk/consts/tributoType';
import ObservacionState from '../dto/observacion-state';
import config from '../../server/configuration/config';
import PersonaFisicaDTO from '../dto/persona-fisica-dto';
import DocumentoState from '../dto/documento-state';
import ContactoState from '../dto/contacto-state';
import PersonaDTO from '../dto/persona-dto';
import { isEmpty, isNull, isValidDate, isValidInteger, isValidString } from '../../infraestructure/sdk/utils/validator';
import CuentaCorrienteItem from '../entities/cuenta-corriente-item';
import { distinctArray } from '../../infraestructure/sdk/utils/helper';
import ConfiguracionService from './configuracion-service';
import Configuracion from '../entities/configuracion';
import TipoMovimiento from '../entities/tipo-movimiento';
import VariableCuenta from '../entities/variable-cuenta';
import VariableCuentaState from '../dto/variable-cuenta-state';
import EtiquetaState from '../dto/etiqueta-state';
import SolicitudDataRequest from '../dto/solicitud-data-request';
import CuentaPago from '../entities/cuenta-pago';
import { RECIBO_TYPE } from '../../infraestructure/sdk/consts/reciboType';
import Cuenta from '../entities/cuenta';
import MicroserviceError from '../../infraestructure/sdk/error/microservice-error';
import RelacionCuentaState from '../dto/relacion-cuenta-state';
import ObraInmuebleState from '../dto/obra-inmueble-state';
import InmuebleDTO from '../dto/inmueble-dto';
import CuentaCorrienteCondicionEspecial from '../entities/cuenta-corriente-condicion-especial';
import Lista from '../entities/lista';


export default class SolicitudService {

    publishService: PublishService;
    configuracionService: ConfiguracionService;
    listaService: ListaService;
    personaService: PersonaService;

    constructor(publishService: PublishService, configuracionService: ConfiguracionService, listaService: ListaService, personaService: PersonaService) {
        this.publishService = publishService;
        this.configuracionService = configuracionService;
        this.listaService = listaService;
        this.personaService = personaService;
    }

    //#region causa
    async verifyCuentaEspecialByCausa(token: string, periodo: string, numeroCausa: string, numeroActa: string = "", dominio: string = "", observacion: string = "", personaInfractor:PersonaDTO = null) {
        return new Promise( async (resolve, reject) => {
            try {
                let cuenta = null;
                const numeroCuenta = `CAUSA${periodo}${numeroCausa.padStart(10,'0')}`;
                const paramUrlCuenta = `/filter?idCuenta=0&idTipoTributo=${TRIBUTO_TYPE.CUENTAS_ESPECIALES}&numeroCuenta=${numeroCuenta}&numeroWeb=&idPersona=0&etiqueta=&numeroDocumentoContribuyente=`;
                const cuentas = await SendRequest(token, paramUrlCuenta, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA) as any[];
                if (cuentas.length > 1) {
                    reject(new ValidationError('Cuenta incorrecta'));
                    return; 
                }
                else if (cuentas.length === 1) {
                    cuenta = cuentas[0];
                }
                else if (isNull(personaInfractor)) {
                    reject(new ValidationError('Cuenta no identificada'));
                    return; 
                }
                else {
                    const listas = await this.listaService.listByTipos(token, "Variable") as any;
                    const variablesDefinicion = listas.Variable as any[];

                    const observaciones: string[] = [];
                    const etiquetas: string[] = [];
                    const variables: VariableCuenta[] = [];
                    if (isValidString(dominio,true)) {
                        const definicion = variablesDefinicion.find(f => f.codigo === 'DOMINIO_VEHICULO_INFRACCION');
                        if (definicion) {
                            variables.push(new VariableCuenta(0, definicion.id, 0, dominio));
                        }
                        observaciones.push(`Dominio: ${dominio}`);
                        etiquetas.push(`CAUSAS`);
                        etiquetas.push(`CAUSAS_DOMINIO_${dominio}`);
                    }
                    if (isValidString(numeroActa,true)) {
                        const definicion = variablesDefinicion.find(f => f.codigo === 'NUMERO_ACTA');
                        if (definicion) {
                            variables.push(new VariableCuenta(0, definicion.id, 0, numeroActa));
                        }
                        observaciones.push(`Número de acta: ${numeroActa}`);
                    }
                    if (isValidString(numeroCausa,true)) observaciones.push(`Número de causa: ${numeroCausa}`);
                    if (isValidString(periodo,true)) observaciones.push(`Periodo: ${periodo}`);
                    if (isValidString(observacion,true)) observaciones.push(`Observación de causa: ${observacion}`);
                    if (isValidString(personaInfractor.numeroDocumento)) {
                        etiquetas.push(`CAUSAS_PERSONA_${personaInfractor.codigoTipoDocumento}_${personaInfractor.numeroDocumento}`);
                    }

                    const persona = await this.getPersonaFisica(token, personaInfractor) as Persona;
                    cuenta = await this.addCuentaEspecial(token, numeroCuenta, persona, variables, observaciones, etiquetas);
                }
                
                resolve(cuenta);
            }
            catch(error) {
                if (error instanceof ValidationError || error instanceof ProcessError) {
                    reject(error);
                }
                else {
                    if (error.statusCode && error.message) {
                        reject(new ApiError(error.message, error.statusCode));
                    }
                    else {
                        reject(new ProcessError('Error procesando datos', error));
                    }
                }
            }
        });
    }

    async addByCausa(token: string, idUsuario: number, solicitud: SolicitudRequest, idTipoTributo: number, codigoReciboEspecial: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const parameters = solicitud.parameters as SolicitudDataRequest;

                //#region concepto de recibo especial
                const paramUrlRE = `/filter?codigo=${codigoReciboEspecial}&descripcion=&idTipoTributo=0&activo=true`;
                const reciboEspeciales = await SendRequest(token, paramUrlRE, null, REQUEST_METHOD.GET, APIS.URLS.RECIBO_ESPECIAL) as any[];
                if (reciboEspeciales.length !== 1) {
                    reject(new ValidationError('Definición de Vep indefinida'));
                    return; 
                }
                const idReciboEspecial = reciboEspeciales[0].id;

                const reciboEspecial = await SendRequest(token, `/${idReciboEspecial}`, null, REQUEST_METHOD.GET, APIS.URLS.RECIBO_ESPECIAL) as any;
                if (reciboEspecial.recibosEspecialConcepto.length === 0) {
                    reject(new ValidationError('Definición de conceptos indefinidos'));
                    return; 
                }
                const concepto = reciboEspecial.recibosEspecialConcepto[0];
                //#endregion

                const paramUrlCuenta = `/filter?idCuenta=0&idTipoTributo=${idTipoTributo}&numeroCuenta=${parameters.numeroCuenta}&numeroWeb=&idPersona=0&etiqueta=&numeroDocumentoContribuyente`;
                const cuentas = await SendRequest(token, paramUrlCuenta, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA) as any[];
                if (cuentas.length !== 1) {
                    reject(new ValidationError('Cuenta incorrecta'));
                    return; 
                }
                const idCuenta = cuentas[0].id;
                const idTipoDocumentoContribuyente = cuentas[0].idTipoDocumentoContribuyente;
                const numeroDocumentoContribuyente = cuentas[0].numeroDocumentoContribuyente;

                //#region datos de partida a ajustar
                const paramsUrl = `/saldo?idCuenta=${idCuenta}&idSubTasa=${concepto.idSubTasa}&fechaDesde=&fechaHasta=&periodoDesde=&periodoHasta=&cuotaDesde=0&cuotaHasta=0`;
                const data = await SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA_CORRIENTE_ITEM) as any;
                if (data.cuentaCorrienteItems.length > 0) {
                    reject(new ValidationError('El tipo de infracción ya fue dada de alta en la causa presente'));
                    return; 
                }
                //#endregion

                const personas = await this.personaService.listByDocumento(token, idTipoDocumentoContribuyente, numeroDocumentoContribuyente) as any[];
                if (personas.length !== 1) {
                    reject(new ValidationError('Contribuyenbte incorrecto'));
                    return; 
                }
                const idPersona = personas[0].id;

                const pagoReciboEspecial = new PagoReciboEspecial(
                    idCuenta, idPersona, 0, 0, "", "",
                    idReciboEspecial, 1, parameters.periodo, parameters.cuota,
                    parameters.fechaVencimiento, true, true,
                    RECIBO_TYPE.RECIBO_WEB
                );

                //#region condiciones especiales
                const codigoTipoCondicionEspecialSolicitudExterna = await this.configuracionService.findByNombre(token, "TipoCondicionEspecialSolicitudExterna") as Configuracion;
                if (!codigoTipoCondicionEspecialSolicitudExterna) {
                    reject(new ValidationError('No se pudo obtener el código de tipo condición de solicitud externa'));
                    return; 
                }
                const tipoCondicionesEspeciales = await this.listaService.listByTipos(token,"TipoCondicionEspecial") as Lista[];
                const tipoCondicionEspecialSolicitudExterna = tipoCondicionesEspeciales["TipoCondicionEspecial"].find(f => f.codigo === codigoTipoCondicionEspecialSolicitudExterna.valor);
                if (!tipoCondicionEspecialSolicitudExterna) {
                    reject(new ValidationError('No se pudo obtener el tipo condición de solicitud externa'));
                    return; 
                }

                const ctaCteCondEspecial = new CuentaCorrienteCondicionEspecial();
                ctaCteCondEspecial.idTipoCondicionEspecial = tipoCondicionEspecialSolicitudExterna.id;
                ctaCteCondEspecial.numeroMovimiento = idReciboEspecial;
                ctaCteCondEspecial.numeroComprobante = parameters.idSolicitud;
                pagoReciboEspecial.cuentaCorrienteCondicionesEspeciales.push(ctaCteCondEspecial);
                //#endregion

                const result = await SendRequest(token, '/pago-derecho-especial', pagoReciboEspecial, REQUEST_METHOD.POST, APIS.URLS.CUENTA_CORRIENTE_ITEM) as any;

                try {
                    const dataAddEvento = {
                        token: token,
                        idTipoEvento: 24, //Solicitud Interfaz
                        idUsuario: idUsuario,
                        fecha: getDateNow(true),
                        idModulo: 30,
                        origen: `laramie-interface-webapi/solicitud-service/addByCausa`,
                        mensaje: `Solicitud Interfaz - Generación de Deuda`,
                        data: solicitud,
                    };
                    await this.publishService.sendMessage("laramie-interface-webapi/solicitud-service/addByCausa", "AddEvento", idUsuario.toString(), dataAddEvento);
                }
                catch {/*es solo un log, no se toma accion*/}

                resolve({
                    idCuentaPago: result.idCuentaPago,
                    periodo: parameters.periodo,
                    numeroCausa: parameters.numeroCausa
                });
            }
            catch(error) {
                if (error.statusCode && error.message) {
                    reject(new ApiError(error.message, error.statusCode));
                }
                else {
                    reject(new ProcessError('Error procesando datos', error));
                }
            }
        });
    }

    async addAjusteByCausa(token: string, idUsuario: number, solicitud: SolicitudRequest, idTipoTributo: number, codigoReciboEspecial: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const parameters = solicitud.parameters as SolicitudDataRequest;

                //#region tipo-movimiento debito/credito
                const listas = await this.listaService.listByTipos(token, "TipoMovimiento") as any;
                const tiposMovimiento = listas.TipoMovimiento as any[];
                const codigoTipoMovimientoDebito = await this.configuracionService.findByNombre(token, "CuentaCorrienteCodigoTipoMovimientoDebito") as Configuracion;
                const codigoTipoMovimientoCredito = await this.configuracionService.findByNombre(token, "CuentaCorrienteCodigoTipoMovimientoCredito") as Configuracion;
                const tipoMovimientoDebito = tiposMovimiento.find(f => f.codigo === codigoTipoMovimientoDebito.valor) as TipoMovimiento;
                const tipoMovimientoCredito = tiposMovimiento.find(f => f.codigo === codigoTipoMovimientoCredito.valor) as TipoMovimiento;
                if (!tipoMovimientoDebito || !tipoMovimientoCredito) {
                    reject(new ValidationError('Tipo de movimiento Débito/Crédito indefinido'));
                    return; 
                }
                const idTipoMovimientoDebito = tipoMovimientoDebito.id;
                const idTipoMovimientoCredito = tipoMovimientoCredito.id;
                //#endregion

                //#region concepto de recibo especial
                const paramUrlRE = `/filter?codigo=${codigoReciboEspecial}&descripcion=&idTipoTributo=0&activo=true`;
                const reciboEspeciales = await SendRequest(token, paramUrlRE, null, REQUEST_METHOD.GET, APIS.URLS.RECIBO_ESPECIAL) as any[];
                if (reciboEspeciales.length !== 1) {
                    reject(new ValidationError('Definición de Vep indefinida'));
                    return; 
                }
                const idReciboEspecial = reciboEspeciales[0].id;

                const reciboEspecial = await SendRequest(token, `/${idReciboEspecial}`, null, REQUEST_METHOD.GET, APIS.URLS.RECIBO_ESPECIAL) as any;
                if (reciboEspecial.recibosEspecialConcepto.length === 0) {
                    reject(new ValidationError('Definición de conceptos indefinidos'));
                    return; 
                }
                const concepto = reciboEspecial.recibosEspecialConcepto[0];
                //#endregion

                //#region datos de partida a ajustar
                const paramUrlCuenta = `/filter?idCuenta=0&idTipoTributo=${idTipoTributo}&numeroCuenta=${parameters.numeroCuenta}&numeroWeb=&idPersona=0&etiqueta=&numeroDocumentoContribuyente`;
                const cuentas = await SendRequest(token, paramUrlCuenta, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA) as any[];
                if (cuentas.length !== 1) {
                    reject(new ValidationError('Cuenta incorrecta'));
                    return; 
                }
                const idCuenta = cuentas[0].id;

                const paramsUrl = `/saldo?idCuenta=${idCuenta}&idSubTasa=${concepto.idSubTasa}&fechaDesde=&fechaHasta=&periodoDesde=&periodoHasta=&cuotaDesde=0&cuotaHasta=0`;
                const data = await SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA_CORRIENTE_ITEM) as any;
                if (data.cuentaCorrienteItems.length === 0) {
                    reject(new ValidationError('La partida no tiene deuda para ajustar'));
                    return; 
                }
                const numerosPartidas = distinctArray(data.cuentaCorrienteItems.map(x => x.numeroPartida));
                if (numerosPartidas.length > 1) {
                    reject(new ValidationError(`Hay más de una partida identificada para esa tasa`));
                    return;
                }
                //#endregion

                //#region item de ajuste
                const itemBase: CuentaCorrienteItem = data.cuentaCorrienteItems[data.cuentaCorrienteItems.length-1]; //tomo de base el ultimo
                const ajuste = new CuentaCorrienteItem();
                ajuste.numeroPartida = itemBase.numeroPartida;
                ajuste.codigoDelegacion = itemBase.codigoDelegacion;
                ajuste.item = (itemBase.item + 1);
                ajuste.idTipoMovimiento = (parameters.importe > 0) ? idTipoMovimientoDebito : idTipoMovimientoCredito;

                ajuste.idUsuarioRegistro = idUsuario;
                ajuste.fechaRegistro = getDateNow(true);
                ajuste.idCuenta = idCuenta;
                ajuste.idTasa = concepto.idTasa;
                ajuste.idSubTasa = concepto.idSubTasa;
                ajuste.periodo = parameters.periodo;
                ajuste.cuota = 0;
                ajuste.importeDebe = (parameters.importe > 0) ? Math.abs(parameters.importe) : 0;
                ajuste.importeHaber = (parameters.importe < 0) ? Math.abs(parameters.importe) : 0;
                ajuste.fechaVencimiento1 = parameters.fechaVencimiento;
                ajuste.fechaVencimiento2 = parameters.fechaVencimiento;
                ajuste.fechaVencimiento1Original = parameters.fechaVencimiento;
                ajuste.fechaVencimiento2Original = parameters.fechaVencimiento;
                ajuste.detalle = parameters.observacion;
                //#endregion

                const body = {
                    idCuenta: idCuenta,
                    cuentaCorrienteItem: ajuste
                }
                await SendRequest(token, '/ajuste', body, REQUEST_METHOD.POST, APIS.URLS.CUENTA_CORRIENTE_ITEM);

                try {
                    const dataAddEvento = {
                        token: token,
                        idTipoEvento: 24, //Solicitud Interfaz
                        idUsuario: idUsuario,
                        fecha: getDateNow(true),
                        idModulo: 30,
                        origen: `laramie-interface-webapi/solicitud-service/addAjusteByCausa`,
                        mensaje: `Solicitud Interfaz - Generación de Deuda`,
                        data: solicitud,
                    };
                    await this.publishService.sendMessage("laramie-interface-webapi/solicitud-service/addAjusteByCausa", "AddEvento", idUsuario.toString(), dataAddEvento);
                    }
                catch {/*es solo un log, no se toma accion*/}

                resolve({
                    periodo: parameters.periodo,
                    numeroCausa: parameters.numeroCausa
                });
            }
            catch(error) {
                if (error.statusCode && error.message) {
                    reject(new ApiError(error.message, error.statusCode));
                }
                else {
                    reject(new ProcessError('Error procesando datos', error));
                }
            }
        });
    }

    async listByCausa(token: string, consulta: ConsultaRequest) {
		return new Promise( async (resolve, reject) => {
			try {
                const parameters = consulta.parameters;

                if (!isValidString(parameters.numeroCuenta,true) &&
                    !isValidString(parameters.dominio,true) &&
                    !(isValidString(parameters.codigoTipoDocumento,true) && isValidString(parameters.numeroDocumento,true)) &&
                    !isValidDate(parameters.fechaVencido,true))
                {
                    reject(new ValidationError('Debe ingresar un filtro'));
                    return;
                }

                const paramUrlCuenta = isValidString(parameters.numeroCuenta,true) ?
                    `/filter?idCuenta=0&idTipoTributo=15&numeroCuenta=${parameters.numeroCuenta}&numeroWeb=&idPersona=0&numeroDocumentoContribuyente&etiqueta=`:
                                       isValidString(parameters.dominio,true) ?
                    `/filter?idCuenta=0&idTipoTributo=15&numeroCuenta=&numeroWeb=&idPersona=0&numeroDocumentoContribuyente&etiqueta=CAUSAS_DOMINIO_${parameters.dominio}` :
                                       isValidString(parameters.numeroDocumento,true) ?
                    `/filter?idCuenta=0&idTipoTributo=15&numeroCuenta=&numeroWeb=&idPersona=0&numeroDocumentoContribuyente&etiqueta=CAUSAS_PERSONA_${parameters.codigoTipoDocumento}_${parameters.numeroDocumento}`
                    :
                    `/filter?idCuenta=0&idTipoTributo=15&numeroCuenta=&numeroWeb=&idPersona=0&numeroDocumentoContribuyente&etiqueta=CAUSAS`;
                const cuentas = await SendRequest(token, paramUrlCuenta, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA) as any[];
                if (cuentas.length === 0) resolve([])

                const idCuentas = distinctArray(cuentas.map(x => x.id));

                let items: CuentaCorrienteItemResumen[] = [];
                for(let i=0; i<idCuentas.length; i++) {
                    const cuenta = cuentas.find(f => f.id === idCuentas[i]) as any;
                    let fechaDesde = encodeURIComponent(getDateSerialize(parameters.fechaDesde));
                    let fechaHasta = encodeURIComponent(getDateSerialize(parameters.fechaHasta));
                    const paramsUrl = `/saldo?idCuenta=${cuenta.id}&idSubTasa=0` + 
                                    `&fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}` +
                                    `&periodoDesde=${parameters.periodoDesde}&periodoHasta=${parameters.periodoHasta}` +
                                    `&cuotaDesde=${parameters.cuotaDesde}&cuotaHasta=${parameters.cuotaHasta}`;
                    let data = await SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA_CORRIENTE_ITEM) as any;

                    if (parameters.fechaVencido) {
                        data.cuentaCorrienteItems.forEach(x => {
                            if (!isEmpty(x.fechaVencimiento1)) x.fechaVencimiento1 = new Date(x.fechaVencimiento1.toString());
                            if (!isEmpty(x.fechaVencimiento2)) x.fechaVencimiento2 = new Date(x.fechaVencimiento2.toString());
                        });
                        data.cuentaCorrienteItems = data.cuentaCorrienteItems.filter(f => f.fechaVencimiento2.getTime() <= parameters.fechaVencido.getTime());
                    }

                    const itemsPartial = await this.listSaldo(token, cuenta.id, cuenta.numeroCuenta, data, true) as CuentaCorrienteItemResumen[];
                    items = items.concat(itemsPartial);
                }

                resolve(items);
			}
			catch(error) {
                if (error.statusCode && error.message) {
                    reject(new ApiError(error.message, error.statusCode));
                }
                else {
                    reject(new ProcessError('Error procesando datos', error));
                }
			}
		});
    }

    async createVep(token: string, idUsuario: number, solicitud: SolicitudRequest, idTipoTributo: number) {
        return new Promise( async (resolve, reject) => {
            try {
                const parameters = solicitud.parameters as SolicitudDataRequest;

                const paramUrlCuenta = `/filter?idCuenta=0&idTipoTributo=${idTipoTributo}&numeroCuenta=${parameters.numeroCuenta}&numeroWeb=&idPersona=0&etiqueta=&numeroDocumentoContribuyente`;
                const cuentas = await SendRequest(token, paramUrlCuenta, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA) as any[];
                if (cuentas.length !== 1) {
                    reject(new ValidationError('Cuenta incorrecta'));
                    return; 
                }
                const idCuenta = cuentas[0].id;

                const paramsUrl = `/recibo-comun`;
                const dataBody = {
                    idCuenta: idCuenta,
                    fechaVencimiento: getDateNow(),
                    items: parameters.items,
                    notificacionPago: true,
			        idTipoRecibo: RECIBO_TYPE.RECIBO_WEB
                };
                
                const result = await SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.POST, APIS.URLS.CUENTA_CORRIENTE_ITEM);

                resolve(result);
            }
            catch(error) {
                if (error.statusCode && error.message) {
                    reject(new ApiError(error.message, error.statusCode));
                }
                else {
                    reject(new ProcessError('Error procesando datos', error));
                }
            }
        });
    }

    async createPlanPagoCuentaEspecial(token: string, idUsuario: number, solicitud: SolicitudRequest) {
        return new Promise( async (resolve, reject) => {
            try {
                const dataAddEvento = {
                    token: token,
                    idTipoEvento: 24, //Solicitud Interfaz
                    idUsuario: idUsuario,
                    fecha: getDateNow(true),
                    idModulo: 30,
                    origen: `laramie-interface-webapi/solicitud-service/createPlanPago`,
                    mensaje: `Solicitud Interfaz - Generación de Plan de Pago`,
                    data: solicitud,
                };
                await this.publishService.sendMessage("laramie-interface-webapi/solicitud-service/createPlanPago", "AddEvento", idUsuario.toString(), dataAddEvento);

                const parameters = solicitud.parameters as SolicitudDataRequest;

                const paramUrlCuenta = `/filter?idCuenta=0&idTipoTributo=15&numeroCuenta=${parameters.numeroCuenta}&numeroWeb=&idPersona=0&etiqueta=&numeroDocumentoContribuyente`;
                const cuentas = await SendRequest(token, paramUrlCuenta, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA) as any[];
                if (cuentas.length !== 1) {
                    reject(new ValidationError('Cuenta incorrecta'));
                    return; 
                }
                const idCuenta = cuentas[0].id;
                
                const dataBody:any = {
                    items: parameters.items
                };
                const planesPagoDef = await SendRequest(token, `/cuenta/${idCuenta}`, dataBody, REQUEST_METHOD.PUT, APIS.URLS.PLAN_PAGO_DEFINICION) as any[];
                const planePagoDef = planesPagoDef.find(f => f.codigo.startsWith("INFRACCION_") && f.porcentajeAnticipo === parameters.anticipo);
                if (!planePagoDef) {
                    reject(new ValidationError('Plan de Pago incorrecto'));
                    return; 
                }

                const idTipoVinculoEspecialTitular = 101; //TITULAR (Cuentas Especiales)
                dataBody.idPlanPagoDefinicion = planePagoDef.id;
                dataBody.idCuenta = idCuenta;
                dataBody.idTipoVinculoCuenta = idTipoVinculoEspecialTitular;
                dataBody.idVinculoCuenta = 0; //se define automaticamente en la api de ing pub
                dataBody.cantidadCuotas = parameters.cuotas;
                const planPago = await SendRequest(token, null, dataBody, REQUEST_METHOD.POST, APIS.URLS.PLAN_PAGO) as any;
                
                const cuentaPagos = await SendRequest(token, `/plan-pago/${planPago.id}`, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA_PAGO) as CuentaPago[];

                let idCuentaPago = null;
                let esAnticipo = false;
                if (cuentaPagos.length > 0) {
                    cuentaPagos.sort((a,b) => a.cuota - b.cuota);
                    const cuentaPago1 = cuentaPagos[0];
                    idCuentaPago = cuentaPago1.id;
                    esAnticipo = (cuentaPago1.cuota === 0);
                }

                resolve({
                    idCuentaPago,
                    esAnticipo
                });
            }
            catch(error) {
                if (error.statusCode && error.message) {
                    reject(new ApiError(error.message, error.statusCode));
                }
                else {
                    reject(new ProcessError('Error procesando datos', error));
                }
            }
        });
    }
    //#endregion 

    //#region volquete
    async listByReciboEspecial(token: string, consulta: ConsultaRequest, idTipoTributo: number, codigoReciboEspecial: string) {
		return new Promise( async (resolve, reject) => {
			try {
                const parameters = consulta.parameters;

                const paramUrlRE = `/filter?codigo=${codigoReciboEspecial}&descripcion=&idTipoTributo=0&activo=true`;
                const reciboEspeciales = await SendRequest(token, paramUrlRE, null, REQUEST_METHOD.GET, APIS.URLS.RECIBO_ESPECIAL) as any[];
                if (reciboEspeciales.length !== 1) {
                    reject(new ValidationError('Definición de Vep indefinida'));
                    return; 
                }
                const idReciboEspecial = reciboEspeciales[0].id;

                const reciboEspecial = await SendRequest(token, `/${idReciboEspecial}`, null, REQUEST_METHOD.GET, APIS.URLS.RECIBO_ESPECIAL) as any;
                if (reciboEspecial.recibosEspecialConcepto.length === 0) {
                    reject(new ValidationError('Definición de conceptos indefinidos'));
                    return; 
                }
                const idSubTasa = reciboEspecial.recibosEspecialConcepto[0].idSubTasa;

                const paramUrlCuenta = `/filter?idCuenta=0&idTipoTributo=${idTipoTributo}&numeroCuenta=${parameters.numeroCuenta}&numeroWeb=&idPersona=0&etiqueta=&numeroDocumentoContribuyente`;
                const cuentas = await SendRequest(token, paramUrlCuenta, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA) as any[];
                if (cuentas.length !== 1) {
                    reject(new ValidationError('Cuenta incorrecta'));
                    return; 
                }
                const idCuenta = cuentas[0].id;

                let fechaDesde = encodeURIComponent(getDateSerialize(parameters.fechaDesde));
                let fechaHasta = encodeURIComponent(getDateSerialize(parameters.fechaHasta));
                const paramsUrl = `/saldo?idCuenta=${idCuenta}&idSubTasa=${idSubTasa}` + 
                                  `&fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}` +
                                  `&periodoDesde=${parameters.periodoDesde}&periodoHasta=${parameters.periodoHasta}` +
                                  `&cuotaDesde=${parameters.cuotaDesde}&cuotaHasta=${parameters.cuotaHasta}`;
                const data = await SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA_CORRIENTE_ITEM) as any;

                const items = await this.listSaldo(token, idCuenta, parameters.numeroCuenta, data, true) as CuentaCorrienteItemResumen[];

                resolve(items);
			}
			catch(error) {
                if (error.statusCode && error.message) {
                    reject(new ApiError(error.message, error.statusCode));
                }
                else {
                    reject(new ProcessError('Error procesando datos', error));
                }
			}
		});
    }
    //#endregion

    //#region comunes
    async addReciboEspecial(token: string, idUsuario: number, solicitud: SolicitudRequest, idTipoTributo: number, codigoReciboEspecial: string, derechoEspecial: boolean) {
        return new Promise( async (resolve, reject) => {
            try {
                const parameters = solicitud.parameters;

                const paramUrlRE = `/filter?codigo=${codigoReciboEspecial}&descripcion=&idTipoTributo=0&activo=true`;
                const reciboEspeciales = await SendRequest(token, paramUrlRE, null, REQUEST_METHOD.GET, APIS.URLS.RECIBO_ESPECIAL) as any[];
                if (reciboEspeciales.length !== 1) {
                    reject(new ValidationError('Definición de Vep indefinida'));
                    return; 
                }
                const idReciboEspecial = reciboEspeciales[0].id;

                const paramUrlCuenta = `/filter?idCuenta=0&idTipoTributo=${idTipoTributo}&numeroCuenta=${parameters.numeroCuenta}&numeroWeb=&idPersona=0&etiqueta=&numeroDocumentoContribuyente`;
                const cuentas = await SendRequest(token, paramUrlCuenta, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA) as any[];
                if (cuentas.length !== 1) {
                    reject(new ValidationError('Cuenta incorrecta'));
                    return; 
                }
                const idCuenta = cuentas[0].id;
                const idTipoDocumentoContribuyente = cuentas[0].idTipoDocumentoContribuyente;
                const numeroDocumentoContribuyente = cuentas[0].numeroDocumentoContribuyente;

                const personas = await this.personaService.listByDocumento(token, idTipoDocumentoContribuyente, numeroDocumentoContribuyente) as any[];
                if (personas.length !== 1) {
                    reject(new ValidationError('Contribuyenbte incorrecto'));
                    return; 
                }
                const idPersona = personas[0].id;

                const pagoReciboEspecial = new PagoReciboEspecial(
                    idCuenta, idPersona, 0, 0, "", "",
                    idReciboEspecial, parameters.cantidad, parameters.periodo, parameters.cuota,
                    parameters.fechaVencimiento, derechoEspecial, true,
			        RECIBO_TYPE.RECIBO_WEB
                );
                if (derechoEspecial) {
                    const codigoTipoCondicionEspecialSolicitudExterna = await this.configuracionService.findByNombre(token, "TipoCondicionEspecialSolicitudExterna") as Configuracion;
                    if (!codigoTipoCondicionEspecialSolicitudExterna) {
                        reject(new ValidationError('No se pudo obtener el código de tipo condición de solicitud externa'));
                        return; 
                    }
                    const tipoCondicionesEspeciales = await this.listaService.listByTipos(token,"TipoCondicionEspecial") as Lista[];
                    const tipoCondicionEspecialSolicitudExterna = tipoCondicionesEspeciales["TipoCondicionEspecial"].find(f => f.codigo === codigoTipoCondicionEspecialSolicitudExterna.valor);
                    if (!tipoCondicionEspecialSolicitudExterna) {
                        reject(new ValidationError('No se pudo obtener el tipo condición de solicitud externa'));
                        return; 
                    }

                    const ctaCteCondEspecial = new CuentaCorrienteCondicionEspecial();
                    ctaCteCondEspecial.idTipoCondicionEspecial = tipoCondicionEspecialSolicitudExterna.id;
                    ctaCteCondEspecial.numeroMovimiento = idReciboEspecial;
                    ctaCteCondEspecial.numeroComprobante = parameters.idSolicitud;
                    pagoReciboEspecial.cuentaCorrienteCondicionesEspeciales.push(ctaCteCondEspecial);
                }

                const params = derechoEspecial ? '/pago-derecho-especial' : '/pago-recibo-especial';
                const result = await SendRequest(token, params, pagoReciboEspecial, REQUEST_METHOD.POST, APIS.URLS.CUENTA_CORRIENTE_ITEM) as any;

                try {
                    const dataAddEvento = {
                        token: token,
                        idTipoEvento: 24, //Solicitud Interfaz
                        idUsuario: idUsuario,
                        fecha: getDateNow(true),
                        idModulo: 30,
                        origen: `laramie-interface-webapi/solicitud-service/add`,
                        mensaje: `Solicitud Interfaz - Generación de Deuda`,
                        data: solicitud,
                    };
                    await this.publishService.sendMessage("laramie-interface-webapi/solicitud-service/addReciboEspecial", "AddEvento", idUsuario.toString(), dataAddEvento);
                }
                catch {/*es solo un log, no se toma accion*/}

                resolve({
                    idCuentaPago: result.idCuentaPago,
                    numeroCuenta:  cuentas[0].numeroCuenta
                });
            }
            catch(error) {
                if (error.statusCode && error.message) {
                    reject(new ApiError(error.message, error.statusCode));
                }
                else {
                    reject(new ProcessError('Error procesando datos', error));
                }
            }
        });
    }

    async addCuentaEspecialWithPersona(token: string, codigoTipoDocumento: string, numeroDocumento: string, etiquetas: string[], personaDTO:PersonaDTO = null) {
        return new Promise( async (resolve, reject) => {
            try {
                const listas = await this.listaService.listByTipos(token, "TipoDocumento") as any;
                const tiposDocumento = listas.TipoDocumento;
                const tipoDocumento = tiposDocumento.find(f => f.codigo === codigoTipoDocumento);
                if (!tipoDocumento) {
                    reject(new ValidationError('Tipo documento incorrecto'));
                    return;       
                }
                const idTipoDocumentoContribuyente = tipoDocumento.id;
                const numeroDocumentoContribuyente = numeroDocumento;

                const personas = await this.personaService.listByDocumento(token, idTipoDocumentoContribuyente, numeroDocumentoContribuyente) as any[];
                if (personas.length > 1 || personas.length === 0 && (!personaDTO || personaDTO.numeroDocumento.length === 0)) {
                    reject(new ValidationError('Contribuyente incorrecto'));
                    return; 
                }

                let persona:Persona = null;
                if (personas.length > 0) {
                    persona = personas[0];
                }
                else {
                    persona = await this.getPersonaFisica(token, personaDTO) as Persona;
                }
                const cuenta = await this.addCuentaEspecial(token, "", persona, [], [], etiquetas);
                
                resolve(cuenta);
            }
            catch(error) {
                if (error instanceof ValidationError || error instanceof ProcessError) {
                    reject(error);
                }
                else {
                    if (error.statusCode && error.message) {
                        reject(new ApiError(error.message, error.statusCode));
                    }
                    else {
                        reject(new ProcessError('Error procesando datos', error));
                    }
                }
            }
        });
    }

    async sendNotificacionPago(token: string, cuentaPago: CuentaPago, pagoRecibo: any) {
        return new Promise( async (resolve, reject) => {
            let notificacion = {};
            try {
                if (!isValidInteger(cuentaPago.idCuenta, true)) {
                    reject(new ValidationError('Cuenta incorrecta'));
                    return;
                }

                const cuenta = await SendRequest(token, `/${cuentaPago.idCuenta}`, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA) as Cuenta;
                
                let tipoSollicitud = '';
                let idSolicitud = '';
                let numeroCuentaInmueble = '';

                //id y tipo de solicitud estan en las etiquetas (unica partida por cuenta)
                if (cuenta.idTipoTributo === TRIBUTO_TYPE.CUENTAS_ESPECIALES && !cuenta.numeroCuenta.startsWith("CAUSA")) {
                    const especialDto = await SendRequest(token, `/${cuenta.idTributo}`, null, REQUEST_METHOD.GET, APIS.URLS.ESPECIAL) as EspecialDTO;
                    const etiquetaTipoSolicitud = especialDto.etiquetas.find(f => f.codigo.startsWith('TIPO_SOLICITUD:'));
                    const etiquetaIdSolicitud = especialDto.etiquetas.find(f => f.codigo.startsWith('ID_SOLICITUD:'));
                    if (!etiquetaTipoSolicitud || !etiquetaIdSolicitud) {
                        throw new ValidationError("No se pudo identificar los datos de la solicitud");
                    }
                    tipoSollicitud = etiquetaTipoSolicitud.codigo.replace('TIPO_SOLICITUD:','');
                    idSolicitud = etiquetaIdSolicitud.codigo.replace('ID_SOLICITUD:','');

                    const esObraInicio = (tipoSollicitud === 'SOLICITUD_OBRA_INICIO');
                    if (esObraInicio) {
                        const etiquetaCuentaInmueble = especialDto.etiquetas.find(f => f.codigo.startsWith('CUENTA_INMUEBLE:'));
                        if (etiquetaCuentaInmueble) {
                            const items = await SendRequest(token, `/cuenta-pago/${cuentaPago.id}`, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA_PAGO_ITEM) as any[];
                            if (items.length === 0) {
                                reject(new ValidationError('No se pudo identificar items en el recibo'));
                                return;
                            }
                            const {idTasa, idSubTasa, importeTotal} = items[0];

                            numeroCuentaInmueble = etiquetaCuentaInmueble.codigo.replace('CUENTA_INMUEBLE:','');
                            const cuentaInmueble = await SendRequest(token, `/numero-cuenta/10/${numeroCuentaInmueble}`, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA) as Cuenta;
                            
                            const inmuebleDto = await SendRequest(token, `/${cuentaInmueble.idTributo}`, null, REQUEST_METHOD.GET, APIS.URLS.INMUEBLE) as InmuebleDTO;
                            const relacionCuenta = new RelacionCuentaState(-1, cuenta.id, cuentaInmueble.id, "a");
                            inmuebleDto.relacionesCuentas.push(relacionCuenta);
                            const obraInmueble = new ObraInmuebleState(-1, cuentaInmueble.idTributo, idTasa, idSubTasa, 0, "", 0, importeTotal);
                            obraInmueble.state = "a";
                            inmuebleDto.obrasInmueble.push(obraInmueble);

                            await SendRequest(token, `/${cuentaInmueble.idTributo}`, inmuebleDto, REQUEST_METHOD.PUT, APIS.URLS.INMUEBLE);
                        }                   
                    }
                }
                else //id y tipo de solicitud estan en las cond esp cta cat (multiples partida por cuenta)
                if (cuenta.idTipoTributo === TRIBUTO_TYPE.CUENTAS_ESPECIALES && cuenta.numeroCuenta.startsWith("CAUSA") ||
                    cuenta.idTipoTributo === TRIBUTO_TYPE.COMERCIOS) {
                    const items = await SendRequest(token, `/cuenta-pago/${cuentaPago.id}`, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA_PAGO_ITEM) as any[];
                    if (items.length === 0) {
                        reject(new ValidationError('No se pudo identificar items en el recibo'));
                        return;
                    }
                    const numeroPartida = items[0].numeroPartida;

                    const codigoTipoCondicionEspecialSolicitudExterna = await this.configuracionService.findByNombre(token, "TipoCondicionEspecialSolicitudExterna") as Configuracion;
                    if (!codigoTipoCondicionEspecialSolicitudExterna) {
                        reject(new ValidationError('No se pudo obtener el código de tipo condición de solicitud externa'));
                        return; 
                    }
                    const tipoCondicionesEspeciales = await this.listaService.listByTipos(token,"TipoCondicionEspecial") as Lista[];
                    const tipoCondicionEspecialSolicitudExterna = tipoCondicionesEspeciales["TipoCondicionEspecial"].find(f => f.codigo === codigoTipoCondicionEspecialSolicitudExterna.valor);
                    if (!tipoCondicionEspecialSolicitudExterna) {
                        reject(new ValidationError('No se pudo obtener el tipo condición de solicitud externa'));
                        return; 
                    }

                    const params = `/cuenta/${cuentaPago.idCuenta}`;
                    const ctaCteCondEspecialesXCuenta = await SendRequest(token, params, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA_CORRIENTE_CONDICION_ESPECIAL) as CuentaCorrienteCondicionEspecial[];
                    const ctaCteCondEspecialSolicitudExterna = ctaCteCondEspecialesXCuenta.find(f => 
                        f.idTipoCondicionEspecial === tipoCondicionEspecialSolicitudExterna.id &&
                        f.numeroPartida === numeroPartida);
                    if (ctaCteCondEspecialSolicitudExterna) {
                        idSolicitud = ctaCteCondEspecialSolicitudExterna.numeroComprobante.toString();
                    }

                    const idReciboEspecial = ctaCteCondEspecialSolicitudExterna.numeroMovimiento;
                    const paramUrlRE = `/${idReciboEspecial}`;
                    const dto = await SendRequest(token, paramUrlRE, null, REQUEST_METHOD.GET, APIS.URLS.RECIBO_ESPECIAL) as any;
                    if (!dto) {
                        reject(new ValidationError('Definición de Vep indefinida'));
                        return; 
                    }
                    tipoSollicitud = `SOLICITUD_${dto.reciboEspecial.codigo}`;
                }

                const urlNotificacion = config.SITE.NOTIFICACION_PAGO;
                notificacion = {
                    tipoSollicitud: tipoSollicitud,
                    idSolicitud: idSolicitud,
                    numeroCuenta: cuenta.numeroCuenta,
                    idCuentaPago: cuentaPago.id,
                    numeroRecibo: `${cuentaPago.codigoDelegacion}-${cuentaPago.numeroRecibo.toString().padStart(10,'0')}`,
                    importe: pagoRecibo.importe,
                    fechaPago: pagoRecibo.fechaCobro
                }
                if (numeroCuentaInmueble.length > 0) notificacion["numeroCuentaInmueble"] = numeroCuentaInmueble;

                await SendRequest(token, null, notificacion, REQUEST_METHOD.POST, urlNotificacion);

                resolve(true);
            }
            catch(error) {
				const origen = "laramie-interface-webapi/solicitud-service/sendNotificacionPago";
				const data = {
					token: `numeroLoteRendicion:${pagoRecibo.numeroLoteRendicion}`,
					idTipoAlerta: 32, //Cuenta Corriente
					idUsuario: 0,
					fecha: getDateNow(true),
					idModulo: 30,
					origen: origen,
					mensaje: "Error Notificación Pago",
					data: {
						pagoRecibo: pagoRecibo,
                        notificacion: notificacion,
						error: castPublicError(error)
					}
				};
				try {
					await this.publishService.sendMessage(origen, "AddAlerta", "0", data);
					resolve(false);
				}
				catch (error) {
					reject(new MicroserviceError('Error enviando AddAlerta', error, "AddAlerta", data));
				}
            }
        });
    }
    //#endregion

    //#region obsoleto
    async verifyCuentaEspecialByDocumento(token: string, codigoTipoDocumento: string, numeroDocumento: string, createIfNotExist: boolean, personaDTO:PersonaDTO = null) {
        return new Promise( async (resolve, reject) => {
            try {
                let cuenta = null;
                const paramUrlCuenta = `/filter?idCuenta=0&idTipoTributo=${TRIBUTO_TYPE.CUENTAS_ESPECIALES}&numeroCuenta=${numeroDocumento}&numeroWeb=&idPersona=0&etiqueta=&numeroDocumentoContribuyente`;
                const cuentas = await SendRequest(token, paramUrlCuenta, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA) as any[];
                if (cuentas.length > 1) {
                    reject(new ValidationError('Cuenta incorrecta'));
                    return; 
                }
                else if (cuentas.length === 1) {
                    cuenta = cuentas[0];
                }
                else {
                    if (createIfNotExist) {
                        const listas = await this.listaService.listByTipos(token, "TipoDocumento") as any;
                        const tiposDocumento = listas.TipoDocumento;
                        const tipoDocumento = tiposDocumento.find(f => f.codigo === codigoTipoDocumento);
                        if (!tipoDocumento) {
                            reject(new ValidationError('Tipo documento incorrecto'));
                            return;       
                        }
                        const idTipoDocumentoContribuyente = tipoDocumento.id;
                        const numeroDocumentoContribuyente = numeroDocumento;

                        const personas = await this.personaService.listByDocumento(token, idTipoDocumentoContribuyente, numeroDocumentoContribuyente) as any[];
                        if (personas.length > 1 || personas.length === 0 && (!personaDTO || personaDTO.numeroDocumento.length === 0)) {
                            reject(new ValidationError('Contribuyente incorrecto'));
                            return; 
                        }

                        let persona:Persona = null;
                        if (personas.length > 0) {
                            persona = personas[0];
                        }
                        else {
                            persona = await this.getPersonaFisica(token, personaDTO) as Persona;
                        }
                        cuenta = await this.addCuentaEspecial(token, persona.numeroDocumento, persona);
                    }
                }
                
                resolve(cuenta);
            }
            catch(error) {
                if (error instanceof ValidationError || error instanceof ProcessError) {
                    reject(error);
                }
                else {
                    if (error.statusCode && error.message) {
                        reject(new ApiError(error.message, error.statusCode));
                    }
                    else {
                        reject(new ProcessError('Error procesando datos', error));
                    }
                }
            }
        });
    }
    //#endregion

    //#region auxiliares
    private async getPersonaFisica(token: string, personaDTO:PersonaDTO) {
        return new Promise( async (resolve, reject) => {
            try {
                const listas = await this.listaService.listByTipos(token, "TipoDocumento") as any;
                const tiposDocumento = listas.TipoDocumento as any[];

                const tipoDocumento = tiposDocumento.find(f => f.codigo === personaDTO.codigoTipoDocumento);
                if (!tipoDocumento) {
                    reject(new ValidationError('Tipo documento incorrecto'));
                    return;       
                }

                let persona = new Persona();
                const personas = await this.personaService.listByDocumento(token, tipoDocumento.id, personaDTO.numeroDocumento) as any[];
                if (personas.length > 1) {
                    reject(new ValidationError('Persona incorrecta'));
                    return; 
                }
                else if (personas.length === 1) {
                    persona.setFromObject(personas[0]);
                }
                else {
                    const listasDireccion = await this.listaService.listByTipos(token, "Pais&Provincia&Localidad") as any;
                    const paises = listasDireccion.Pais;
                    const provincias = listasDireccion.Provincia;
                    const localidades = listasDireccion.Localidad;

                    const pais = paises.find(f => f.codigo === personaDTO.direccionCodigoPais);
                    // if (!pais) {
                    //     reject(new ValidationError('País incorrecto'));
                    //     return;       
                    // }
                    const provincia = provincias.find(f => f.codigo === personaDTO.direccionCodigoProvincia);
                    // if (!provincia) {
                    //     reject(new ValidationError('Provincia incorrecta'));
                    //     return;       
                    // }
                    const localidad = localidades.find(f => f.codigo === personaDTO.direccionCodigoLocalidad);
                    // if (!localidad) {
                    //     reject(new ValidationError('Localidad incorrecta'));
                    //     return;       
                    // }

                    personaDTO.idTipoDocumento = tipoDocumento.id;
                    personaDTO.direccionIdPais = pais ? pais.id : 0;
                    personaDTO.direccionIdProvincia = provincia ? provincia.id : 0;
                    personaDTO.direccionIdLocalidad = localidad ? localidad.id : 0;

                    persona = await this.addPersonaFisica(token, personaDTO) as Persona;
                }

                resolve(persona);
            }
            catch(error) {
                if (error.statusCode && error.message) {
                    reject(new ApiError(error.message, error.statusCode));
                }
                else {
                    reject(new ProcessError('Error procesando datos', error));
                }
            }
        });
    }

    private async listSaldo(token: string, idCuenta: number, numeroCuenta: string, data: any, adjuntarSolicitud: boolean) {
		return new Promise( async (resolve, reject) => {
			try {
                const listas = await this.listaService.listByTipos(token, "Tasa&SubTasa") as any;
                const tasas = listas.Tasa;
                const subtasas = listas.SubTasa;

                let tipoCondicionEspecialSolicitudExterna:Lista = null;
                let ctaCteCondEspecialesXCuenta:CuentaCorrienteCondicionEspecial[] = [];
                if (adjuntarSolicitud) {
                    const codigoTipoCondicionEspecialSolicitudExterna = await this.configuracionService.findByNombre(token, "TipoCondicionEspecialSolicitudExterna") as Configuracion;
                    if (!codigoTipoCondicionEspecialSolicitudExterna) {
                        reject(new ValidationError('No se pudo obtener el código de tipo condición de solicitud externa'));
                        return; 
                    }
                    const tipoCondicionesEspeciales = await this.listaService.listByTipos(token,"TipoCondicionEspecial") as Lista[];
                    tipoCondicionEspecialSolicitudExterna = tipoCondicionesEspeciales["TipoCondicionEspecial"].find(f => f.codigo === codigoTipoCondicionEspecialSolicitudExterna.valor);
                    if (!tipoCondicionEspecialSolicitudExterna) {
                        reject(new ValidationError('No se pudo obtener el tipo condición de solicitud externa'));
                        return; 
                    }

                    const params = `/cuenta/${idCuenta}`;
                    ctaCteCondEspecialesXCuenta = await SendRequest(token, params, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA_CORRIENTE_CONDICION_ESPECIAL) as CuentaCorrienteCondicionEspecial[];
                }

                const items: CuentaCorrienteItemResumen[] = [];
                for (let i=0; i<data.cuentaCorrienteItems.length; i++) {
                    const row = data.cuentaCorrienteItems[i];
                    const item = new CuentaCorrienteItemDeuda();
                    item.setFromObject(row);

                    const itemResumen = new CuentaCorrienteItemResumen();
                    itemResumen.setFromObject(row);
                    itemResumen.numeroCuenta = numeroCuenta;
                    itemResumen.fechaVencimiento = item.fechaVencimiento2;

                    const tasa = tasas.find(f => f.id === item.idTasa);
                    itemResumen.codigoTasa = tasa.codigo;
                    itemResumen.nombreTasa = tasa.descripcion;
                    const subtasa = subtasas.find(f => f.id === item.idSubTasa);
                    itemResumen.codigoSubTasa = subtasa.codigo;
                    itemResumen.nombreSubTasa = subtasa.descripcion;
                    itemResumen.descripcionTasa = subtasa.descripcion;

                    if (adjuntarSolicitud) {
                        const ctaCteCondEspecialSolicitudExterna = ctaCteCondEspecialesXCuenta.find(f => 
                            f.idTipoCondicionEspecial === tipoCondicionEspecialSolicitudExterna.id &&
                            f.numeroPartida === itemResumen.numeroPartida);
                        if (ctaCteCondEspecialSolicitudExterna) {
                            itemResumen.idSolicitud = ctaCteCondEspecialSolicitudExterna.numeroComprobante;
                        }
                    }

                    items.push(itemResumen);
                }

                resolve(items);
			}
			catch(error) {
                reject(new ProcessError('Error procesando datos', error));
			}
		});
    }

    private async addCuentaEspecial(token: string, numeroCuenta:string, persona: Persona, variables:VariableCuenta[] = [], observaciones: string[] = [], etiquetas: string[] = []) {
        return new Promise( async (resolve, reject) => {
            try {
                let especialDTO = new EspecialDTO();
                especialDTO.especial.id = 0;
                especialDTO.especial.idEstadoCarga = 21; //Completa
                especialDTO.especial.idCuenta = 0;
                especialDTO.cuenta.numeroCuenta = numeroCuenta;

                const idTipoVinculoEspecialTitular = 101; //TITULAR (Cuentas Especiales)
                especialDTO.vinculosEspecial.push(new VinculoEspecialState(0, 0, idTipoVinculoEspecialTitular, persona.id, persona.idTipoPersona, persona.idTipoDocumento, persona.numeroDocumento, persona.nombrePersona, 0, null, null, 0, "a"));

                variables.forEach((variable, index) => {
                    const variableState = new VariableCuentaState();
                    variableState.setFromObject(variable);
                    variableState.state = "a";
                    especialDTO.variablesCuenta.push(variableState);
                });

                observaciones.forEach((observacion, index) => {
                    especialDTO.observaciones.push(new ObservacionState(0, 'Especial', index, observacion, parseInt(config.ACCESS_USR_ID), getDateNow(true), "a"));
                });

                etiquetas.forEach((etiqueta, index) => {
                    especialDTO.etiquetas.push(new EtiquetaState(0, 'Especial', index, etiqueta, "a"));
                });

                const paramsUrl = `/importacion`;
                especialDTO = await SendRequest(token, paramsUrl, especialDTO, REQUEST_METHOD.POST, APIS.URLS.ESPECIAL) as EspecialDTO;

                resolve(especialDTO.cuenta);
            }
            catch(error) {
                if (error.statusCode && error.message) {
                    reject(new ApiError(error.message, error.statusCode));
                }
                else {
                    reject(new ProcessError('Error procesando datos', error));
                }
            }
        });
    }

    private async addPersonaFisica(token: string, persona:PersonaDTO) {
        return new Promise( async (resolve, reject) => {
            try {
                const TipoPersona_FISICA = 500;
                const TipoContacto_CELULAR = 524;
                const TipoContacto_TELEFONO = 520;
                const TipoContacto_EMAIL = 525;
                const TipoGeoreferencia_CARGA_DIRECTA = 535;

                let personaFisicaDTO = new PersonaFisicaDTO();

                personaFisicaDTO.persona.idTipoDocumento = persona.idTipoDocumento;
                personaFisicaDTO.persona.numeroDocumento = persona.numeroDocumento;
                personaFisicaDTO.persona.nombre = persona.nombre;
                personaFisicaDTO.persona.apellido = persona.apellido;

                personaFisicaDTO.persona.idNacionalidad = persona.idNacionalidad;
                personaFisicaDTO.persona.idGenero = persona.idGenero;
                personaFisicaDTO.persona.idEstadoCivil = persona.idEstadoCivil;
                personaFisicaDTO.persona.fechaNacimiento = persona.fechaNacimiento;

                personaFisicaDTO.direccion.idTipoGeoreferencia = TipoGeoreferencia_CARGA_DIRECTA;
                personaFisicaDTO.direccion.entidad = "PersonaFisica";
                personaFisicaDTO.direccion.codigoPostal = persona.direccionCodigoPostal;
                personaFisicaDTO.direccion.calle = persona.direccionCalle;
                personaFisicaDTO.direccion.altura = persona.direccionAltura;
                personaFisicaDTO.direccion.piso = persona.direccionPiso;
                personaFisicaDTO.direccion.dpto = persona.direccionDpto;
                personaFisicaDTO.direccion.idPais = persona.direccionIdPais;
                personaFisicaDTO.direccion.idProvincia = persona.direccionIdProvincia;
                personaFisicaDTO.direccion.idLocalidad = persona.direccionIdLocalidad;

                personaFisicaDTO.documentos.push(new DocumentoState(-1, TipoPersona_FISICA, -1, persona.idTipoDocumento, persona.numeroDocumento, true, 'a'));

                if (isValidString(persona.contactoEmail,true)) personaFisicaDTO.contactos.push(new ContactoState(-1, "PersonaFisica", -1, TipoContacto_EMAIL, persona.contactoEmail, 'a'));
                if (isValidString(persona.contactoCelular,true)) personaFisicaDTO.contactos.push(new ContactoState(-1, "PersonaFisica", -1, TipoContacto_CELULAR, persona.contactoCelular, 'a'));
                if (isValidString(persona.contactoTelefono,true)) personaFisicaDTO.contactos.push(new ContactoState(-1, "PersonaFisica", -1, TipoContacto_TELEFONO, persona.contactoTelefono, 'a'));

                const paramsUrl = `/importacion`;
                personaFisicaDTO = await SendRequest(token, paramsUrl, personaFisicaDTO, REQUEST_METHOD.POST, APIS.URLS.ADMINISTRACION_PERSONA_FISICA) as PersonaFisicaDTO;

                const result = new Persona(
                    personaFisicaDTO.persona.id,
                    TipoPersona_FISICA,
                    `${personaFisicaDTO.persona.nombre} ${personaFisicaDTO.persona.apellido}`,
                    personaFisicaDTO.persona.idTipoDocumento,
                    personaFisicaDTO.persona.numeroDocumento
                );

                resolve(result);
            }
            catch(error) {
                if (error.statusCode && error.message) {
                    reject(new ApiError(error.message, error.statusCode));
                }
                else {
                    reject(new ProcessError('Error procesando datos', error));
                }
            }
        });
    }
    //#endregion
}
