import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { CreateRequest, SendRequest } from '../../infraestructure/sdk/utils/request';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ValidationError from "../../infraestructure/sdk/error/validation-error";


export default class EntidadService {

    constructor() {

    }

    async listByDefinicion(token: string) {
        const paramsUrl = `/definicion`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.ENTIDAD);
    }

    async listByTipos(token: string, tipos: string) {
        return this.listByTiposFilter(token, tipos);
    }

    async listByTiposFilter(token: string, tipos: string, idFilter: any = null) {
        const lTipos = tipos.split('&');
        return new Promise( async (resolve, reject) => {
            try {
                
                let fetchTipos = [];
                for (let t=0; t < lTipos.length; t++) {

                    const tipo = lTipos[t];
                    let paramsUrl = null;

                    let urlEndPoint = '';
                    switch(tipo) {
                        case "Usuario":
                            urlEndPoint = APIS.URLS.SEGURIDAD_USUARIO;
                            break;
                        case "ZonaGeoreferencia":
                            urlEndPoint = APIS.URLS.ADMINISTRACION_ZONA_GEOREFERENCIA;
                            break;
                        case "TemaExpediente":
                            urlEndPoint = APIS.URLS.ADMINISTRACION_TEMA_EXPEDIENTE;
                            break;
                        case "TipoPlanPago":
                            urlEndPoint = APIS.URLS.TIPO_PLAN_PAGO;
                            break;
                        case "TipoVencimientoPlanPago":
                            urlEndPoint = APIS.URLS.TIPO_VENCIMIENTO_PLAN_PAGO;
                            break;
                        case "TipoVinculoCuenta":
                            urlEndPoint = APIS.URLS.TIPO_VINCULO_CUENTA;
                            break;

                        default:
                            urlEndPoint = this.getUrlEndPointWritableEntidad(tipo);
                            if (urlEndPoint === "") {
                                urlEndPoint = this.getUrlEndPointReadOnlyEntidad(tipo);
                            }
                            if (urlEndPoint === "") {
                                urlEndPoint = this.getUrlEndPointWritableLista(tipo);
                            }
                            if (urlEndPoint === "") {
                                urlEndPoint = this.getUrlEndPointReadOnlyLista(tipo);
                            }
                            if (urlEndPoint === "") {
                                urlEndPoint = APIS.URLS.ENTIDAD;
                                paramsUrl = `/${tipo}`;
                            }
                            break;
                    }

                    if (idFilter) {
                        switch(tipo) {
                            case "Cuenta":
                                paramsUrl = `/filter?`+
                                `idCuenta=${idFilter}&`+
                                `idTipoTributo=0&numeroCuenta=&numeroWeb=&idPersona=0&etiqueta=`;
                                break;
                            case "TipoVinculoCuenta":
                                paramsUrl = `/tipo-tributo/${idFilter}`;
                                break;
                            case "ClaseElemento":
                                paramsUrl = `/clase-elemento/${idFilter}`;
                                break;
                            default:
                                break;
                        }               
                    }

                    const request = CreateRequest(
                        REQUEST_METHOD.GET,
                        null,
                        token,
                        urlEndPoint,
                        paramsUrl,
                        null
                    );
                    fetchTipos.push(fetch(request.url, request.options));
                }

                Promise.all(fetchTipos)
                .then(async (responses) => {
                    let dataTipos = {};
                    for (let r=0; r < responses.length; r++) {
                        const response = responses[r];
                        if (response.ok) {
                            try {
                                const data = await response.json();
                                dataTipos[lTipos[r]] = data;
                            }
                            catch(error) {
                                reject(new ProcessError('Error procesando resultado', error));
                                return;
                            }
                        }
                        else {
                            response.json().then(reject).catch(reject);
                            return;
                        }
                    }
                    resolve(dataTipos);
                })
                .catch((error) => {
                    reject(new ProcessError('Error de conexión', error));
                });
                
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async findById(token: string, tipo: string, id: number) {
        let urlEndPoint = this.getUrlEndPointWritableEntidad(tipo);
        if (urlEndPoint === "") {
            urlEndPoint = this.getUrlEndPointReadOnlyEntidad(tipo);
        }
        if (urlEndPoint === "") {
            urlEndPoint = this.getUrlEndPointWritableLista(tipo);
        }
        if (urlEndPoint === "") {
            urlEndPoint = this.getUrlEndPointReadOnlyLista(tipo);
        }

        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, urlEndPoint);
    }

    async add(token: string, tipo: string, dataBody: object) {
        let urlEndPoint = this.getUrlEndPointWritableEntidad(tipo);
        if (urlEndPoint === "") {
            urlEndPoint = this.getUrlEndPointWritableLista(tipo);
        }
        if (urlEndPoint === "") {
            return new Promise((resolve, reject) => reject(new ValidationError('La entidad no está definida como editable')));
        }

        return SendRequest(token, null, dataBody, REQUEST_METHOD.POST, urlEndPoint);
    }

    async modify(token: string, tipo: string, id: number, dataBody: object) {
        let urlEndPoint = this.getUrlEndPointWritableEntidad(tipo);
        if (urlEndPoint === "") {
            urlEndPoint = this.getUrlEndPointWritableLista(tipo);
        }
        if (urlEndPoint === "") {
            return new Promise((resolve, reject) => reject(new ValidationError('La entidad no está definida como editable')));
        }

        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, urlEndPoint);
    }

    async remove(token: string, tipo: string, id: number) {
        let urlEndPoint = this.getUrlEndPointWritableEntidad(tipo);
        if (urlEndPoint === "") {
            urlEndPoint = this.getUrlEndPointWritableLista(tipo);
        }
        if (urlEndPoint === "") {
            return new Promise((resolve, reject) => reject(new ValidationError('La entidad no está definida como editable')));
        }

        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.DELETE, urlEndPoint);
    }


    getUrlEndPointWritableEntidad(tipo: string) {
        let urlEndPoint = '';

        switch(tipo) {
            case "Obra":
                urlEndPoint = APIS.URLS.OBRA;
                break;
            case "TipoSuperficie":
                urlEndPoint = APIS.URLS.TIPO_SUPERFICIE;
                break;
            case "GrupoSuperficie":
                urlEndPoint = APIS.URLS.GRUPO_SUPERFICIE;
                break;
            case "TipoCondicionEspecial":
                urlEndPoint = APIS.URLS.TIPO_CONDICION_ESPECIAL;
                break;
            case "TipoInstrumento":
                urlEndPoint = APIS.URLS.TIPO_INSTRUMENTO;
                break;
            case "Rubro":
                urlEndPoint = APIS.URLS.RUBRO;
                break;
            case "TipoRecargoDescuento":
                urlEndPoint = APIS.URLS.TIPO_RECARGO_DESCUENTO;
                break;
            case "IncisoVehiculo":
                urlEndPoint = APIS.URLS.INCISO_VEHICULO;
                break;
            case "TipoVehiculo":
                urlEndPoint = APIS.URLS.TIPO_VEHICULO;
                break;
            case "CategoriaVehiculo":
                urlEndPoint = APIS.URLS.CATEGORIA_VEHICULO;
                break;
            case "RubroLiquidacion":
                urlEndPoint = APIS.URLS.RUBRO_LIQUIDACION;
                break;
            case "ZonaTarifaria":
                urlEndPoint = APIS.URLS.ZONA_TARIFARIA;
                break;
            case "Grupo":
                urlEndPoint = APIS.URLS.GRUPO;
                break;
            case "TipoConstruccionFuneraria":
                urlEndPoint = APIS.URLS.TIPO_CONSTRUCCION_FUNERARIA;
                break;
            case "TipoRubroComercio":
                urlEndPoint = APIS.URLS.TIPO_RUBRO_COMERCIO;
                break;
            case "RubroProvincia":
                urlEndPoint = APIS.URLS.RUBRO_PROVINCIA;
                break;
            case "RubroBCRA":
                urlEndPoint = APIS.URLS.RUBRO_BCRA;
                break;
            case "MotivoBajaRubroComercio":
                urlEndPoint = APIS.URLS.MOTIVO_BAJA_RUBRO_COMERCIO;
                break;
            case "UbicacionComercio":
                urlEndPoint = APIS.URLS.UBICACION_COMERCIO;
                break;
            case "Cocheria":
                urlEndPoint = APIS.URLS.COCHERIA;
                break;
            case "RegistroCivil":
                urlEndPoint = APIS.URLS.REGISTRO_CIVIL;
                break;
            case "CategoriaTasa":
                urlEndPoint = APIS.URLS.CATEGORIA_TASA;
                break;
            case "TipoAnuncio":
                urlEndPoint = APIS.URLS.TIPO_ANUNCIO;
                break;
            case "CategoriaUbicacion":
                urlEndPoint = APIS.URLS.CATEGORIA_UBICACION;
                break;
            case "MotivoBajaComercio":
                urlEndPoint = APIS.URLS.MOTIVO_BAJA_COMERCIO;
                break;
            case "ObjetoCertificado":
                urlEndPoint = APIS.URLS.OBJETO_CERTIFICADO;
                break;
            case "Escribano":
                urlEndPoint = APIS.URLS.ESCRIBANO;
                break;
            case "TipoDDJJ":
                urlEndPoint = APIS.URLS.TIPO_DDJJ;
                break;
            case "TipoControlador":
                urlEndPoint = APIS.URLS.TIPO_CONTROLADOR;
                break;
            case "TipoElemento":
                urlEndPoint = APIS.URLS.TIPO_ELEMENTO;
                break;
            default:
                urlEndPoint = "";
                break;
        }

        return urlEndPoint;
    }

    getUrlEndPointReadOnlyEntidad(tipo: string) {
        let urlEndPoint = '';
        
        switch(tipo) {
            case "Procedimiento":
                urlEndPoint = APIS.URLS.PROCEDIMIENTO;
                break;
            case "EmisionDefinicion":
                urlEndPoint = APIS.URLS.EMISION_DEFINICION;
                break;
            case "EmisionEjecucion":
                urlEndPoint = APIS.URLS.EMISION_EJECUCION;
                break;
            case "EmisionNumeracion":
                urlEndPoint = APIS.URLS.EMISION_NUMERACION;
                break;
            case "Variable":
                urlEndPoint = APIS.URLS.VARIABLE;
                break;
            case "Cuenta":
                urlEndPoint = APIS.URLS.CUENTA;
                break;
            case "Tasa":
                urlEndPoint = APIS.URLS.TASA;
                break;
            case "SubTasa":
                urlEndPoint = APIS.URLS.SUB_TASA;
                break;
            case "Controlador":
                urlEndPoint = APIS.URLS.CONTROLADOR;
                break;
            case "Apremio":
                urlEndPoint = APIS.URLS.APREMIO;
                break;
            case "OrganoJudicial":
                urlEndPoint = APIS.URLS.ORGANO_JUDICIAL;
                break;
            case "TipoRelacionCertificadoApremioPersona":
                urlEndPoint = APIS.URLS.TIPO_RELACION_CERTIFICADO_APREMIO_PERSONA;
                break;
            case "TipoActoProcesal":
                urlEndPoint = APIS.URLS.TIPO_ACTO_PROCESAL;
                break;
            case "TipoMovimiento":
                urlEndPoint = APIS.URLS.TIPO_MOVIMIENTO;
                break;
            case "ClaseElemento":
                urlEndPoint = APIS.URLS.CLASE_ELEMENTO;
                break;
            case "Filtro":
                urlEndPoint = APIS.URLS.FILTRO;
                break;
            case "PlanPagoDefinicion":
                urlEndPoint = APIS.URLS.PLAN_PAGO_DEFINICION;
                break;
            case "ReciboEspecial":
                urlEndPoint = APIS.URLS.RECIBO_ESPECIAL;
                break;

            case "Pais":
                urlEndPoint = APIS.URLS.PAIS;
                break;
            case "Provincia":
                urlEndPoint = APIS.URLS.PROVINCIA;
                break;
            case "Localidad":
                urlEndPoint = APIS.URLS.LOCALIDAD;
                break;
            //TODO: Remover las siguientes entidades una vez que se genere el ABM en Administración.
            case "Jurisdiccion":
                urlEndPoint = APIS.URLS.ADMINISTRACION_JURISDICCION;
                break;
            case "CuentaContable":
                urlEndPoint = APIS.URLS.ADMINISTRACION_CUENTA_CONTABLE;
                break;
            case "RecursoPorRubro":
                urlEndPoint = APIS.URLS.ADMINISTRACION_RECURSO_POR_RUBRO;
                break;
            default:
                urlEndPoint = "";
                break;
        }

        return urlEndPoint;
    }

    getUrlEndPointWritableLista(tipo: string) {
        let urlEndPoint = '';

        switch(tipo) {
            case "TipoObraSuperficie":
            case "DestinoSuperficie":
            case "TipoValuacion":
            case "TipoObra":
            case "DestinoObra":
            case "FormaPresentacionObra":
            case "FormaCalculoObra":
            case "FrecuenciaFacturacion":
            case "TipoSolicitudDebitoAutomatico":
            case "MotivoBajaVehiculo":
            case "OrigenFabricacion":
            case "Combustible":
            case "FinalidadVehiculo":
            case "MotivoFallecimiento":
            case "TipoOrigenInhumacion":
            case "TipoDestinoInhumacion":
            case "Cementerio":
            case "MotivoInspeccion":
            case "ResultadoVerificacion":
            case "TipoPropiedad":
            case "BloqueoEmision":
            case "TipoCertificado":
            case "TipoPlantillaDocumento":
            case "InspeccionCertificadoApremio":
            case "TipoCuota":
            case "TipoCitacion":
            case "TipoControlador":
                urlEndPoint = `${APIS.URLS.LISTA}/${tipo}`;
                break;
            default:
                urlEndPoint = "";
                break;
        }

        return urlEndPoint;
    }
    
    getUrlEndPointReadOnlyLista(tipo: string) {
        let urlEndPoint = '';

        switch(tipo) {
            case "EstadoCuenta":
            case "TipoTributo":
            case "EstadoCarga":
            case "TipoLado":
            case "TipoVinculoInmueble":
            case "TipoVinculoComercio":
            case "TipoVinculoVehiculo":
            case "TipoVinculoCementerio":
            case "TipoVinculoFondeadero":
            case "TipoVinculoEspecial":
            case "Ordenamiento":
            case "OrdenamientoGeneral":
            case "TipoVariable":
            case "CategoriaFuncion":
            case "Numeracion":
            case "EstadoEmisionDefinicion":
            case "TipoEmisionCalculo":
            case "EstadoEmisionEjecucion":
            case "EstadoEmisionEjecucionCuenta":
            case "EstadoEmisionCalculoResultado":
            case "EstadoEmisionConceptoResultado":
            case "EstadoEmisionCuentaCorrienteResultado":
            case "EstadoEmisionImputacionContableResultado":
            case "LugarPago":
            case "TipoValor":
            case "EmisionProceso":
            case "EstadoAprobacion":
            case "EstadoProceso":
            case "EstadoCertificadoApremio":
            case "UnidadMedida":
                urlEndPoint = `${APIS.URLS.LISTA}/${tipo}`;
                break;
            case "TipoDocumento":
                urlEndPoint = `${APIS.URLS.ADMINISTRACION_LISTA}/${tipo}`;
                break;
            default:
                urlEndPoint = "";
                break;
        }

        return urlEndPoint;
    }

}
