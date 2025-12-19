import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';
import ApiError from "../../infraestructure/sdk/error/api-error";
import ProcessError from "../../infraestructure/sdk/error/process-error";
import ValidationError from "../../infraestructure/sdk/error/validation-error";
import ModeloDeclaracionJurada from "../entities/modelo-declaracion-jurada";
import ModeloDeclaracionJuradaDto from "../entities/modelo-declaracion-jurada-dto";
import ClaseDeclaracionJuradaDto from "../entities/clase-declaracion-jurada-dto";
import RubroDto from "../entities/rubro-dto";
import TipoDeclaracionJuradaDto from "../entities/tipo-declaracion-jurada-dto";
import DeclaracionJurada from "../entities/declaracion-jurada";
import { TRIBUTO_TYPE } from "../../infraestructure/sdk/consts/tributoType";
import Rubro from "../entities/rubro";
import ConfiguracionService from "./configuracion-service";
import Configuracion from "../entities/configuracion";
import ComercioDTO from "../entities/comercio-dto";
import ListaService from "./lista-service";
import Lista from "../entities/lista";
import FondeaderoDTO from "../entities/fondeadero-dto";
import { FONDEADERO_TYPE } from "../../infraestructure/sdk/consts/fondeaderoType";
import { isNull } from "../../infraestructure/sdk/utils/validator";
import { getDateNow, iifNull, precisionRound } from "../../infraestructure/sdk/utils/convert";
import CondicionEspecial from "../entities/condicion-especial";


export default class DeclaracionJuradaService {

    configuracionService: ConfiguracionService;
    listaService: ListaService;

    constructor(configuracionService: ConfiguracionService, listaService: ListaService) {
        this.configuracionService = configuracionService;
        this.listaService = listaService;
    }

    async listPresentadas(token: string, idPersona: number, idCuenta: number) {
		return new Promise( async (resolve, reject) => {
			try {
                let paramsUrl = `/web/${idPersona}/${idCuenta}`;
                const cuenta = await SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA) as any;
                if (!cuenta || cuenta.id === 0) {
                    reject(new ValidationError('No se pudo obtener los datos de la cuenta'));
                    return
                }
                if (!cuenta.idTipoVinculoCuenta || !cuenta.idVinculoCuenta) {
                    reject(new ValidationError('No se pudo identificar el vinculo con la cuenta'));
                    return
                }
                if (![60,61,90,91].includes(cuenta.idTipoVinculoCuenta)) {
                    reject(new ValidationError('El tipo de vinculo con la cuenta no tiene acceso'));
                    return
                }

                const modelos = await SendRequest(token, null, null, REQUEST_METHOD.GET, APIS.URLS.MODELO_DECLARACION_JURADA) as any[];
                const modelosXCuenta = modelos.filter(f => f.idTipoTributo === cuenta.idTipoTributo).map(x => {
                    const item = new ModeloDeclaracionJurada();
                    item.setFromObject(x);
                    return item;
                }) as ModeloDeclaracionJurada[];

                paramsUrl = `/cuenta/${idCuenta}`;
                const data = await SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.DECLARACION_JURADA) as any[];
                const declaracionesJuradas = data.map(x => {
                    const modelo = modelosXCuenta.find(f => f.id === x.idModeloDeclaracionJurada);
                    const item = new DeclaracionJurada();
                    item.setFromObject(x);
                    item.descModeloDeclaracionJurada = modelo.nombre;
                    return item;
                });

                resolve(declaracionesJuradas);
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

    async findById(token: string, idPersona: number, idCuenta: number, idDeclaracionJurada: number) {
		return new Promise( async (resolve, reject) => {
			try {
                let paramsUrl = `/web/${idPersona}/${idCuenta}`;
                const cuenta = await SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA) as any;
                if (!cuenta || cuenta.id === 0) {
                    reject(new ValidationError('No se pudo obtener los datos de la cuenta'));
                    return
                }
                if (!cuenta.idTipoVinculoCuenta || !cuenta.idVinculoCuenta) {
                    reject(new ValidationError('No se pudo identificar el vinculo con la cuenta'));
                    return
                }
                if (![60,61,90,91].includes(cuenta.idTipoVinculoCuenta)) {
                    reject(new ValidationError('El tipo de vinculo con la cuenta no tiene acceso'));
                    return
                }

                const modelos = await SendRequest(token, null, null, REQUEST_METHOD.GET, APIS.URLS.MODELO_DECLARACION_JURADA) as any[];
                const modelosXCuenta = modelos.filter(f => f.idTipoTributo === cuenta.idTipoTributo).map(x => {
                    const item = new ModeloDeclaracionJurada();
                    item.setFromObject(x);
                    return item;
                }) as ModeloDeclaracionJurada[];

                paramsUrl = `/${idDeclaracionJurada}`;
                const ddjj = await SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.DECLARACION_JURADA) as any;

                const modelo = modelosXCuenta.find(f => f.id === ddjj.idModeloDeclaracionJurada);
                const declaracionJurada = new DeclaracionJurada();
                declaracionJurada.setFromObject(ddjj);
                declaracionJurada.descModeloDeclaracionJurada = modelo.nombre;

                resolve(declaracionJurada);
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

    async list(token: string, idPersona: number, idCuenta: number) {
		return new Promise( async (resolve, reject) => {
			try {
                let paramsUrl = `/web/${idPersona}/${idCuenta}`;
                const cuenta = await SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA) as any;
                if (!cuenta || cuenta.id === 0) {
                    reject(new ValidationError('No se pudo obtener los datos de la cuenta'));
                    return
                }
                if (!cuenta.idTipoVinculoCuenta || !cuenta.idVinculoCuenta) {
                    reject(new ValidationError('No se pudo identificar el vinculo con la cuenta'));
                    return
                }
                if (![60,61,90,91].includes(cuenta.idTipoVinculoCuenta)) {
                    reject(new ValidationError('El tipo de vinculo con la cuenta no tiene acceso'));
                    return
                }

				const toDay = getDateNow(false);
                const modelos = await SendRequest(token, null, null, REQUEST_METHOD.GET, APIS.URLS.MODELO_DECLARACION_JURADA) as any[];
                modelos.sort((a,b) => a.orden - b.orden);

                const modelosXCuenta = modelos.filter(f => f.activo && f.idTipoTributo === cuenta.idTipoTributo).map(x => {
                    const item = new ModeloDeclaracionJurada();
                    item.setFromObject(x);
                    return item;
                }) as ModeloDeclaracionJurada[];

                let modelosXCuentaTributo = [];
                if (cuenta.idTipoTributo === TRIBUTO_TYPE.COMERCIOS) {
                    const listas = await this.listaService.listByTipos(token, "TipoCondicionEspecial");
                    const tipoCondicionEspeciales = listas["TipoCondicionEspecial"] as Lista[];
                    const tipoCondicionEspecialTributaingresos = tipoCondicionEspeciales.find(f => f.codigo === 'DDJJ_TI');
                    const tipoCondicionEspecialMantenimientoVial = tipoCondicionEspeciales.find(f => f.codigo === 'DDJJ_MV');
                    const tipoCondicionEspecialEnvasesNR = tipoCondicionEspeciales.find(f => f.codigo === 'DDJJ_ENR');
                    const tipoCondicionEspecialExplotacionCanteras = tipoCondicionEspeciales.find(f => f.codigo === 'DDJJ_EC');
                    const tipoCondicionEspecialTAP = tipoCondicionEspeciales.find(f => f.codigo === 'DDJJ_TAP');
                    const tipoCondicionEspecialMarcas = tipoCondicionEspeciales.find(f => f.codigo === 'DDJJ_MS');
                    const tipoCondicionEspecialAntenas = tipoCondicionEspeciales.find(f => f.codigo === 'DDJJ_ANTENAS');
                    const tipoCondicionMonotasa = tipoCondicionEspeciales.find(f => f.codigo === 'MONOTASA');

                    const rubros = await SendRequest(token, null, null, REQUEST_METHOD.GET, APIS.URLS.RUBRO) as Rubro[];
                    const rubroEstacionServicio = rubros.find(f => f.codigo === "18"); //ESTACION DE SERVICIO
                    const rubrosGestionAmbiental = rubros.filter(f => f.categoria === "3");

                    const comercioDto = await SendRequest(token, `/${cuenta.idTributo}`, null, REQUEST_METHOD.GET, APIS.URLS.COMERCIO) as ComercioDTO;
                    
                    for (let i = 0; i < modelosXCuenta.length; i++) {
                        const modelo = modelosXCuenta[i];
                    
                        switch (modelo.codigo) {
                            case "0003": // TISH -- Campana
                                if (
                                    !comercioDto.condicionesEspeciales
                                        .filter(f => {
                                            const desde = f.fechaDesde ? new Date(f.fechaDesde) : null;
                                            const hasta = f.fechaHasta ? new Date(f.fechaHasta) : null;
                                            return (!desde || desde <= toDay) && (!hasta || hasta >= toDay);
                                        })
                                        .some(x =>
                                            tipoCondicionMonotasa &&
                                            Number(tipoCondicionMonotasa.id) === Number(x.idTipoCondicionEspecial)
                                        )
                                ) {
                                    modelosXCuentaTributo.push(modelo);    
                                }
                                break;
                    
                            case "0004": // Mantenimiento vial -- Campana
                                if (
                                    comercioDto.condicionesEspeciales
                                        .filter(f => {
                                            const desde = f.fechaDesde ? new Date(f.fechaDesde) : null;
                                            const hasta = f.fechaHasta ? new Date(f.fechaHasta) : null;
                                            return (!desde || desde <= toDay) && (!hasta || hasta >= toDay);
                                        })
                                        .some(x =>
                                            tipoCondicionEspecialMantenimientoVial &&
                                            Number(tipoCondicionEspecialMantenimientoVial.id) === Number(x.idTipoCondicionEspecial)
                                        )
                                ) {
                                    modelosXCuentaTributo.push(modelo);
                                }
                                break;
                    
                            case "0005": // Envases no retornables -- Campana
                                if (
                                    comercioDto.condicionesEspeciales
                                        .filter(f => {
                                            const desde = f.fechaDesde ? new Date(f.fechaDesde) : null;
                                            const hasta = f.fechaHasta ? new Date(f.fechaHasta) : null;
                                            return (!desde || desde <= toDay) && (!hasta || hasta >= toDay);
                                        })
                                        .some(x =>
                                            tipoCondicionEspecialEnvasesNR &&
                                            Number(tipoCondicionEspecialEnvasesNR.id) === Number(x.idTipoCondicionEspecial)
                                        )
                                ) {
                                    modelosXCuentaTributo.push(modelo);
                                }
                                break;
                    
                            case "0006": // Explotación de canteras -- Campana
                                if (
                                    comercioDto.condicionesEspeciales
                                        .filter(f => {
                                            const desde = f.fechaDesde ? new Date(f.fechaDesde) : null;
                                            const hasta = f.fechaHasta ? new Date(f.fechaHasta) : null;
                                            return (!desde || desde <= toDay) && (!hasta || hasta >= toDay);
                                        })
                                        .some(x =>
                                            tipoCondicionEspecialExplotacionCanteras &&
                                            Number(tipoCondicionEspecialExplotacionCanteras.id) === Number(x.idTipoCondicionEspecial)
                                        )
                                ) {
                                    modelosXCuentaTributo.push(modelo);
                                }
                                break;
                    
                            case "0007": // TAP -- Campana
                                if (
                                    comercioDto.condicionesEspeciales
                                        .filter(f => {
                                            const desde = f.fechaDesde ? new Date(f.fechaDesde) : null;
                                            const hasta = f.fechaHasta ? new Date(f.fechaHasta) : null;
                                            return (!desde || desde <= toDay) && (!hasta || hasta >= toDay);
                                        })
                                        .some(x =>
                                            tipoCondicionEspecialTAP &&
                                            Number(tipoCondicionEspecialTAP.id) === Number(x.idTipoCondicionEspecial)
                                        )
                                ) {
                                    modelosXCuentaTributo.push(modelo);
                                }
                                break;
                    
                            case "0008": // Antenas -- Campana
                                if (
                                    comercioDto.condicionesEspeciales
                                        .filter(f => {
                                            const desde = f.fechaDesde ? new Date(f.fechaDesde) : null;
                                            const hasta = f.fechaHasta ? new Date(f.fechaHasta) : null;
                                            return (!desde || desde <= toDay) && (!hasta || hasta >= toDay);
                                        })
                                        .some(x =>
                                            tipoCondicionEspecialAntenas &&
                                            Number(tipoCondicionEspecialAntenas.id) === Number(x.idTipoCondicionEspecial)
                                        )
                                ) {
                                    modelosXCuentaTributo.push(modelo);
                                }
                                break;
                            
                                case "0009": // Marcas y señales -- Campana
                                if (
                                    comercioDto.condicionesEspeciales
                                        .filter(f => {
                                            const desde = f.fechaDesde ? new Date(f.fechaDesde) : null;
                                            const hasta = f.fechaHasta ? new Date(f.fechaHasta) : null;
                                            return (!desde || desde <= toDay) && (!hasta || hasta >= toDay);
                                        })
                                        .some(x =>
                                            tipoCondicionEspecialMarcas &&
                                            Number(tipoCondicionEspecialMarcas.id) === Number(x.idTipoCondicionEspecial)
                                        )
                                ) {
                                    modelosXCuentaTributo.push(modelo);
                                }
                                break;
                                        
                                case "0099": // Habilitaciones - Campana
                                    break;
                    
                            case "1105": // Mensual -- Tigre
                                comercioDto.condicionesEspeciales.forEach(row => {
                                    row.fechaDesde = row.fechaDesde ? new Date(row.fechaDesde) : null;
                                    row.fechaHasta = row.fechaHasta ? new Date(row.fechaHasta) : null;
                                });
                    
                                if (
                                    comercioDto.condicionesEspeciales
                                        .filter(f => (!f.fechaDesde || f.fechaDesde <= toDay) && (!f.fechaHasta || f.fechaHasta >= toDay))
                                        .some(x =>
                                            tipoCondicionEspecialTributaingresos &&
                                            Number(tipoCondicionEspecialTributaingresos.id) === Number(x.idTipoCondicionEspecial)
                                        )
                                ) {
                                    modelosXCuentaTributo.push(modelo);
                                }
                                break;
                    
                            case "1106": // Reciclado -- Tigre
                                if (
                                    comercioDto.rubrosComercio.some(x =>
                                        rubrosGestionAmbiental.map(r => r.id).includes(x.idRubro)
                                    )
                                ) {
                                    modelosXCuentaTributo.push(modelo);
                                }
                                break;
                    
                            case "1107": // Vial Municipal -- Tigre
                                if (
                                    comercioDto.rubrosComercio.some(x =>
                                        rubroEstacionServicio && rubroEstacionServicio.id === x.idRubro
                                    )
                                ) {
                                    modelosXCuentaTributo.push(modelo);
                                }
                                break;
                    
                            default:
                                modelosXCuentaTributo.push(modelo);
                        }
                    }                    
                }
                else if (cuenta.idTipoTributo === TRIBUTO_TYPE.FONDEADEROS) {
                    const fondeaderoDto = await SendRequest(token, `/${cuenta.idTributo}`, null, REQUEST_METHOD.GET, APIS.URLS.FONDEADERO) as FondeaderoDTO;
                    if ([FONDEADERO_TYPE.ACCIDENTALES, FONDEADERO_TYPE.ESTACIONAMIENTO].includes(fondeaderoDto.fondeadero.idTipoFondeadero)) {
                        modelosXCuentaTributo = modelosXCuenta;
                    }
                }

                resolve(modelosXCuentaTributo);
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

    async findByCuenta(token: string, idModeloDeclaracionJurada: number, idCuenta: number) {
		return new Promise( async (resolve, reject) => {
			try {
                const paramsUrl = `/${idModeloDeclaracionJurada}/cuenta/${idCuenta}`;
                const xModelo = await SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.MODELO_DECLARACION_JURADA) as any;

                const modelo = new ModeloDeclaracionJuradaDto();
                modelo.setFromObject(xModelo);
                xModelo.clasesDeclaracionJurada.sort((a,b) => a.orden - b.orden);
                for (let c=0; c < xModelo.clasesDeclaracionJurada.length; c++) {
                    const xClase = xModelo.clasesDeclaracionJurada[c];
                    const clase = new ClaseDeclaracionJuradaDto();
                    clase.setFromObject(xClase);
                    if (!xClase.aplicaRubro) {
                        const xRubroNivelCuenta = {
                            id: 0,
                            codigo: "",
                            nombre: "",
                            tiposDeclaracionJurada: xClase.tiposDeclaracionJurada
                        };
                        xClase.rubros.push(xRubroNivelCuenta); //se agrega rubro custom para cuando no aplica rubros
                    }

                    xClase.rubros.sort((a,b) => a.orden - b.orden);
                    for (let r=0; r < xClase.rubros.length; r++) {
                        const xRubro = xClase.rubros[r];
                        const rubro = new RubroDto();
                        rubro.setFromObject(xRubro);
                    
                        xRubro.tiposDeclaracionJurada.sort((a,b) => a.orden - b.orden);
                        for (let t=0; t < xRubro.tiposDeclaracionJurada.length; t++) {
                            const idTipo = xRubro.tiposDeclaracionJurada[t];
                            const xTipo = xClase.tiposDeclaracionJurada.find(f => f.id === idTipo);
                            const tipo = new TipoDeclaracionJuradaDto();
                            tipo.setFromObject(xTipo);
                            tipo.orden = (t + 1);
                            rubro.tiposDeclaracionJurada.push(tipo);
                        }
                        clase.rubros.push(rubro);
                    }
                    modelo.clasesDeclaracionJurada.push(clase);
                }

                resolve(modelo);
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
    
    async addByWeb(token: string, dataBody: object) {
        const paramsUrl = `/web`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.POST, APIS.URLS.DECLARACION_JURADA);
    }

    async addByWebPreview(token: string, dataBody: object) {
		return new Promise( async (resolve, reject) => {
			try {
                const paramsUrl = `/web/preview`;
                const data = await SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.POST, APIS.URLS.DECLARACION_JURADA) as any;
                
                if (data.conceptos) {
                    data.conceptos.forEach(subtasa => {
                        let importeOriginal = 0;
                        let importeAccesorios = 0;
                        let importeTotal = 0;
                        subtasa.cuotas.forEach(cuotaRubro => {
                            importeOriginal += cuotaRubro.importeOriginal;
                            importeAccesorios += cuotaRubro.importeAccesorios;
                            importeTotal += cuotaRubro.importeTotal;
                        });
                        subtasa["importeOriginal"] = precisionRound(importeOriginal);
                        subtasa["importeAccesorios"] = precisionRound(importeAccesorios);
                        subtasa["importeTotal"] = precisionRound(importeTotal);
                    });
                }

                resolve({
                    generaLiquidacion: !isNull(data.idEmisionDefinicion),
                    generaDeuda: !isNull(data.idCuentaPago),
                    conceptos: data.conceptos,
                    importeCreditosAplicados: data.importeCreditosAplicados
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
    
}
