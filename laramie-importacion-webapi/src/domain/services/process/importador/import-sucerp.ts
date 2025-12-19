import fs from 'fs';
import PublishService from '../../publish-service';
import ConfiguracionService from '../../configuracion-service';
import Configuracion from '../../../entities/configuracion';
import ListaService from '../../lista-service';
import Lista from '../../../entities/lista';
import CuentaService from "../../cuenta-service";
import Cuenta from '../../../entities/cuenta';
import VehiculoService from '../../vehiculo-service';
import VehiculoRow from '../../../dto/vehiculo-row';
import VehiculoDTO from '../../../dto/vehiculo-dto';
import VinculoVehiculoState from '../../../dto/vinculo-vehiculo-state';
import IncisoVehiculoService from '../../inciso-vehiculo-service';
import IncisoVehiculo from '../../../entities/inciso-vehiculo';
import CategoriaVehiculoService from '../../categoria-vehiculo-service';
import CategoriaVehiculo from '../../../entities/categoria-vehiculo';
import TipoCondicionEspecialService from '../../tipo-condicion-especial-service';
import TipoCondicionEspecial from '../../../entities/tipo-condicion-especial';
import PersonaService from '../../persona-service';
import Persona from '../../../entities/persona';
import CondicionEspecialState from '../../../dto/condicion-especial-state';
import CuentaCorrienteItemService from '../../cuenta-corriente-item-service';
import CuentaCorrienteItemRecibo from '../../../dto/cuenta-corriente-item-recibo';
import CuentaCorrienteItemDeuda from '../../../dto/cuenta-corriente-item-deuda';
import CuentaPagoService from '../../cuenta-pago-service';
import CuentaPago from '../../../entities/cuenta-pago';
import ProvinciaService from '../../provincia-service';

import config from '../../../../server/configuration/config';
import ProcessError from '../../../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../../../infraestructure/sdk/error/reference-error';
import { getNamespace } from 'cls-hooked';
import { verifyAccessToken } from '../../../../server/authorization/token';
import { castPublicError, getDateNow, getDateToString } from '../../../../infraestructure/sdk/utils/convert';
import { CloneObject, ensureDirectoryExistence } from '../../../../infraestructure/sdk/utils/helper';
import { TIPO_PERSONA } from '../../../../infraestructure/sdk/consts/tipoPersona';
import PersonaJuridicaDTO from '../../../dto/persona-juridica-dto';
import PersonaFisicaDTO from '../../../dto/persona-fisica-dto';
import DocumentoState from '../../../dto/documento-state';
import Provincia from '../../../entities/provincia';
import ObservacionService from '../../observacion-service';
import EtiquetaService from '../../etiqueta-service';
import EtiquetaState from '../../../dto/etiqueta-state';
import ObservacionState from '../../../dto/observacion-state';
import RecaudacionLote from '../../../entities/recaudacion-lote';
import RecaudacionLoteDto from '../../../dto/recaudacion-lote-dto';
import Recaudacion from '../../../entities/recaudacion';
import TasaService from '../../tasa-service';
import SubTasaService from '../../sub-tasa-service';
import TipoMovimientoService from '../../tipo-movimiento-service';
import Direccion from '../../../entities/direccion';
import { isValidNumber } from '../../../../infraestructure/sdk/utils/validator';

export default class ImportSUCERP {

    publishService: PublishService;
    configuracionService: ConfiguracionService;
    listaService: ListaService;
    cuentaService: CuentaService;
    vehiculoService: VehiculoService;
    incisoVehiculoService: IncisoVehiculoService;
    categoriaVehiculoService: CategoriaVehiculoService;
    tipoCondicionEspecialService: TipoCondicionEspecialService;
    tipoMovimientoService: TipoMovimientoService;
    personaService: PersonaService;
    cuentaCorrienteItemService: CuentaCorrienteItemService;
    cuentaPagoService: CuentaPagoService;
    provinciaService: ProvinciaService;
    observacionService: ObservacionService;
    etiquetaService: EtiquetaService;
    tasaService: TasaService;
    subTasaService: SubTasaService;

    codigoOrganismoSucerp:string;
    codigoRecaudadoraSucerp:string;

    provincias:Provincia[] = [];

    constructor(publishService: PublishService,
        configuracionService: ConfiguracionService, listaService: ListaService,
        cuentaService: CuentaService, vehiculoService: VehiculoService,
        incisoVehiculoService: IncisoVehiculoService, categoriaVehiculoService: CategoriaVehiculoService,
        tipoCondicionEspecialService: TipoCondicionEspecialService, tipoMovimientoService: TipoMovimientoService, personaService: PersonaService,
        cuentaCorrienteItemService: CuentaCorrienteItemService, cuentaPagoService: CuentaPagoService, provinciaService: ProvinciaService,
        observacionService: ObservacionService, etiquetaService: EtiquetaService, tasaService: TasaService, subTasaService: SubTasaService
    ) {
        this.publishService = publishService;
        this.configuracionService = configuracionService;
        this.listaService = listaService;
        this.cuentaService = cuentaService;
        this.vehiculoService = vehiculoService;
        this.incisoVehiculoService = incisoVehiculoService;
        this.categoriaVehiculoService = categoriaVehiculoService;
        this.tipoCondicionEspecialService = tipoCondicionEspecialService;
        this.tipoMovimientoService = tipoMovimientoService;
        this.personaService = personaService,
        this.cuentaCorrienteItemService = cuentaCorrienteItemService;
        this.cuentaPagoService = cuentaPagoService;
        this.provinciaService = provinciaService;
        this.observacionService = observacionService;
        this.etiquetaService = etiquetaService;
        this.tasaService = tasaService;
        this.subTasaService = subTasaService;
        this.codigoOrganismoSucerp = "";
        this.codigoRecaudadoraSucerp = "";
    }

    async import(path: string, idUsuario: number) {
        return new Promise(async (resolve, reject) => {
            try {
                const localStorage = getNamespace('LocalStorage');
                const token = localStorage.get("accessToken");
                const procesaC4 = (config.SUCERP.PROCESA_C4.toString() === "1");

                try {
                    const dataToken = verifyAccessToken(token);
                    if (dataToken) {
                        idUsuario = dataToken.idUsuario;
                    }
                }
                catch {
                    reject(new ReferenceError('Token incorrecto'));
                    return;
                };

                this.provincias = await this.provinciaService.list(token) as Provincia[];
                const configCodigoOrganismoSucerp = await this.configuracionService.findByNombre(token, "CodigoOrganismoSucerp") as Configuracion;
                const configCodigoRecaudadoraSucerp = await this.configuracionService.findByNombre(token, "CodigoRecaudadoraSucerp") as Configuracion;
                if (!configCodigoOrganismoSucerp || !configCodigoRecaudadoraSucerp) {
                    reject(new ReferenceError('No se pudo obtener los parámetros de configuración SUCERP'));
                    return;
                }
                this.codigoOrganismoSucerp = configCodigoOrganismoSucerp.valor;
                this.codigoRecaudadoraSucerp = configCodigoRecaudadoraSucerp.valor;

                const pathFileSource = `${config.PATH.TEMP}${path}`;
                const content = fs.readFileSync(pathFileSource, { encoding: 'utf8', flag: 'r' });
                const rows = content.split('\n');

                const rowHeader = rows[0].split('|');
                const codOrganismoEmisor = (rowHeader[3] === this.codigoOrganismoSucerp);
                if (!codOrganismoEmisor) {
                    reject(new ReferenceError('Código de organismo emisor incorrecto'));
                    return;
                }

                const numeroEnvio = rowHeader[4];
                const fechaEnvio = this.parseDateSucerp(rowHeader[5]);

                const data = {
                    token: token,
                    idTipoEvento: 22, //Interfaz
                    idUsuario: idUsuario,
                    fecha: getDateNow(true),
                    idModulo: 30,
                    origen: "laramie-importacion-webapi/services/import-sucerp",
                    mensaje: "Importacion SUCERP",
                    data: {
                        file: path,
                        header: {
                            constante: rowHeader[0],
                            versionProtocolo: rowHeader[1],
                            numeroRevisionProtocolo: rowHeader[2],
                            codigoOrganismoEmisor: rowHeader[3],
                            numeroEnvio: rowHeader[4],
                            fechaGeneracionArchivo: rowHeader[5]
                        }
                    }
                };

                await this.publishService.sendMessage("laramie-importacion-webapi/services/import-sucerp", "AddEvento", idUsuario.toString(), data);

                let baja = [];
                let alta = [];
                let impuesto = [];
                let cambioTitularidad = [];
                let radicacion = [];

                for (let i = 0; i < rows.length; i++) {
                    //alta impositiva
                    const row = rows[i].split('|');
                    const tipoRegistroAlta = (row[0] === 'C1');
                    const tipoRegistroAltaC = (row[1] === 'C');
                    if (tipoRegistroAlta && tipoRegistroAltaC) {
                        let itemAlta = {
                            codigoOrganismo: row[2],
                            numeroTramite: row[3],
                            codigoTipoTramite: row[4],
                            descripcionTipoTramite: row[5],
                            codigoTipoAccion: row[6],
                            descripcionTipoAccion: row[7],
                            tipoFormulario: row[8],
                            numeroFormulario: row[9],
                            dominioNuevo: row[10],
                            dominioViejo: row[11],
                            codigoMTMFMM: row[12],
                            origen: row[13],
                            categoria: row[14],
                            marca: row[15],
                            tipo: row[16],
                            modelo: row[17],
                            anio: row[18],
                            peso: row[19],
                            carga: row[20],
                            cilindrada: row[21],
                            valuacion: row[22],
                            codigoTipoUso: row[23],
                            descripcionTipoUso: row[24],
                            fechaVigencia: row[25],
                            tipoDocumentoTitularPrincipal: row[26],
                            numeroDocumentoTitularPrincipal: row[27],
                            numeroCUITTitularPrincipal: row[28],
                            nombreTitularPrincipal: row[29],
                            calle: row[30],
                            numero: row[31],
                            piso: row[32],
                            departamento: row[33],
                            barrio: row[34],
                            localidad: row[35],
                            codigoPostal: row[36],
                            provincia: row[37],
                            cantidadTitulares: row[38],
                            codigoRegistroSeccional: row[39],
                            nombreRegistroSeccional: row[40],
                            codigoRegistroSeccionalOrigen: row[41],
                            municipalidadOrigen: row[43],
                            fechaOperacion: row[44],
                            codigoAdicional: row[45].substring(0, 5),
                            incisoAdicional: row[45].substring(24, 25),
                            categoriaAdicional: row[45].substring(64, 65),
                            observaciones: '',
                            titulares: []
                        };
                        alta.push(itemAlta);
                        //titulares alta impositiva
                        let rowT = rows[i + 1].split('|');
                        let tipoRegistroAltaC1 = (rowT[0] === 'C1');
                        let tipoRegistroAltaT = (rowT[1] === 'T');
                        while (tipoRegistroAltaC1 && tipoRegistroAltaT) {
                            i++
                            let titular = {
                                tipoDocumento: rowT[2],
                                numeroDocumento: rowT[3],
                                numeroCUIT: rowT[4],
                                nombreTitular: rowT[5],
                                porcentajeTitularidad: rowT[6],
                                calle: rowT[7],
                                numero: rowT[8],
                                piso: rowT[9],
                                departamento: rowT[10],
                                barrio: rowT[11],
                                localidad: rowT[12],
                                codigoPostal: rowT[13],
                                provincia: rowT[14]
                            };
                            itemAlta.titulares.push(titular)
                            rowT = rows[i + 1].split('|');
                            tipoRegistroAltaC1 = (rowT[0] === 'C1');
                            tipoRegistroAltaT = (rowT[1] === 'T');
                        }
                    }
                    //baja impositiva
                    const rowB = rows[i].split('|');
                    const tipoRegistroBaja = (rowB[0] === 'C2');
                    const tipoRegistroBajaC = (rowB[1] === 'C');
                    if (tipoRegistroBaja && tipoRegistroBajaC) {
                        let itemBaja = {
                            codigoOrganismo: rowB[2],
                            numeroTramite: rowB[3],
                            codigoTipoTramite: rowB[4],
                            descripcionTipoTramite: rowB[5],
                            codigoTipoAccion: rowB[6],
                            descripcionTipoAccion: rowB[7],
                            tipoFormulario: rowB[8],
                            numeroFormulario: rowB[9],
                            dominioNuevo: rowB[10],
                            dominioViejo: rowB[11],
                            codigoMTMFMM: rowB[12],
                            origen: rowB[13],
                            categoria: rowB[14],
                            marca: rowB[15],
                            tipo: rowB[16],
                            modelo: rowB[17],
                            anio: rowB[18],
                            peso: rowB[19],
                            carga: rowB[20],
                            cilindrada: rowB[21],
                            valuacion: rowB[22],
                            codigoTipoUso: rowB[23],
                            descripcionTipoUso: rowB[24],
                            fechaVigencia: rowB[25],
                            cantidadTitulares: rowB[26],
                            codigoRegistroSeccional: rowB[27],
                            nombreRegistroSeccional: rowB[28],
                            codigoRegistroSeccionalDestino: rowB[29],
                            municipalidad: rowB[31],
                            fechaOperacion: rowB[32],
                            codigoAdicional: rowB[33].substring(0, 5),
                            incisoAdicional: rowB[33].substring(24, 25),
                            categoriaAdicional: rowB[33].substring(64, 65),
                            observaciones: '',
                            titulares: []
                        };
                        baja.push(itemBaja);
                    }
                    //impuesto automotor
                    const rowImp = rows[i].split('|');
                    const tipoRegistroImpuesto = (rowImp[0] === 'C4');
                    if (tipoRegistroImpuesto) {
                        let itemImpuesto = {
                            codigoOrganismo: rowImp[1],
                            numeroTramite: rowImp[2],
                            codigoTipoMovimiento: rowImp[3],
                            codigoTipoCuota: rowImp[4],
                            dominioNuevo: rowImp[5],
                            dominioViejo: rowImp[6],
                            periodo: rowImp[7],
                            numeroCuota: rowImp[8],
                            fechaBonificacion: rowImp[9],
                            fechaVencimiento: rowImp[10],
                            flagVencimiento: rowImp[11],
                            importeBonificado: rowImp[12],
                            importeComun: rowImp[13],
                            fechaProceso: rowImp[14],
                            importeTotal: rowImp[15],
                            importeImpuesto: rowImp[16],
                            importePunitorios: rowImp[17],
                            codigoFormaPago: rowImp[18],
                            codigoMoneda: rowImp[19],
                            codigoEntidadBancaria: rowImp[20],
                            descripcionEntidadBancaria: rowImp[21],
                            numeroCheque: rowImp[22],
                            fechaCobro: rowImp[23],
                            fechaTransferencia: rowImp[24],
                            codigoRegistroSeccional: rowImp[25],
                            nombreRegistroSeccional: rowImp[26],
                            reservado: rowImp[27], //reservado para uso del organismo.
                            observaciones: rowImp[28]
                        };
                        impuesto.push(itemImpuesto);
                    }
                    //cambio de titularidad
                    const rowCambioT = rows[i].split('|');
                    const tipoRegistroCambioTitularidad = (rowCambioT[0] === 'C6');
                    const tipoRegistroCambioTitularidadC = (rowCambioT[1] === 'C');
                    if (tipoRegistroCambioTitularidad && tipoRegistroCambioTitularidadC) {
                        let itemCambioTitularidad = {
                            codigoOrganismo: rowCambioT[2],
                            numeroTramite: rowCambioT[3],
                            codigoTipoTramite: rowCambioT[4],
                            descripcionTipoTramite: rowCambioT[5],
                            codigoTipoAccion: rowCambioT[6],
                            descripcionTipoAccion: rowCambioT[7],
                            tipoFormulario: rowCambioT[8],
                            numeroFormulario: rowCambioT[9],
                            dominioNuevo: rowCambioT[10],
                            dominioViejo: rowCambioT[11],
                            codigoMTMFMM: rowCambioT[12],
                            origen: rowCambioT[13],
                            categoria: rowCambioT[14],
                            marca: rowCambioT[15],
                            tipo: rowCambioT[16],
                            modelo: rowCambioT[17],
                            anio: rowCambioT[18],
                            peso: rowCambioT[19],
                            carga: rowCambioT[20],
                            cilindrada: rowCambioT[21],
                            valuacion: rowCambioT[22],
                            codigoTipoUso: rowCambioT[23],
                            descripcionTipoUso: rowCambioT[24],
                            fechaVigencia: rowCambioT[25],
                            tipoDocumentoTitularPrincipal: rowCambioT[26],
                            numeroDocumentoTitularPrincipal: rowCambioT[27],
                            numeroCUITTitularPrincipal: rowCambioT[28],
                            nombreTitularPrincipal: rowCambioT[29],
                            calle: rowCambioT[30],
                            numero: rowCambioT[31],
                            piso: rowCambioT[32],
                            departamento: rowCambioT[33],
                            barrio: rowCambioT[34],
                            localidad: rowCambioT[35],
                            codigoPostal: rowCambioT[36],
                            provincia: rowCambioT[37],
                            cantidadTitulares: rowCambioT[38],
                            codigoRegistroSeccional: rowCambioT[39],
                            nombreRegistroSeccional: rowCambioT[40],
                            fechaOperacion: rowCambioT[41],
                            codigoAdicional: rowCambioT[42].substring(0, 5),
                            incisoAdicional: rowCambioT[42].substring(24, 25),
                            categoriaAdicional: rowCambioT[42].substring(64, 65),
                            observaciones: '',
                            titulares: []
                        };
                        cambioTitularidad.push(itemCambioTitularidad);
                        //titulares cambio titularidad
                        let rowTitular = rows[i + 1].split('|');
                        let tipoRegistroAltaC6 = (rowTitular[0] === 'C6');
                        let tipoRegistroCambioTitularidadT = (rowTitular[1] === 'T');
                        while (tipoRegistroAltaC6 && tipoRegistroCambioTitularidadT) {
                            i++
                            let titular = {
                                tipoTitular: rowTitular[2],
                                tipoDocumento: rowTitular[3],
                                numeroDocumento: rowTitular[4],
                                numeroCUIT: rowTitular[5],
                                nombreTitular: rowTitular[6],
                                porcentajeTitularidad: rowTitular[7],
                                calle: rowTitular[8],
                                numero: rowTitular[9],
                                piso: rowTitular[10],
                                departamento: rowTitular[11],
                                barrio: rowTitular[12],
                                localidad: rowTitular[13],
                                codigoPostal: rowTitular[14],
                                provincia: rowTitular[15]
                            };
                            itemCambioTitularidad.titulares.push(titular)
                            rowTitular = rows[i + 1].split('|');
                            tipoRegistroAltaC6 = (rowTitular[0] === 'C6');
                            tipoRegistroCambioTitularidadT = (rowTitular[1] === 'T');
                        }
                    }
                    //informacion de radicaciones
                    const tipoRegistroRadicacion = row[0] === 'C7';
                    if (tipoRegistroRadicacion) {
                        let itemRadicacion = {
                            codigoOrganismo: row[1],
                            dominio: row[2],
                            estadoRadicacion: row[3],
                            tipoRadicacion: row[4],
                            fechaAlta: row[5],
                            fechaBaja: row[6],
                            origenInformacion: row[7],
                            codigoRegistroSeccional: row[8],
                            nombreRegistroSeccional: row[9],
                            observaciones: '',
                        };
                        radicacion.push(itemRadicacion);
                    }
                }

                const pathFileTarget = `${config.PATH.IMPORTS}${path}`;
                ensureDirectoryExistence(pathFileTarget);
                fs.rename(pathFileSource, pathFileTarget, (err) => {
                    if (err) {
                        reject(new ProcessError('Error moviendo archivo', err));
                        return;
                    }
                });

                await this.executeAlta(alta, idUsuario);
                if (procesaC4) await this.executePago(impuesto, idUsuario, numeroEnvio, fechaEnvio, path);
                await this.executeBaja(baja, idUsuario);
                await this.executeCambioTitularidad(cambioTitularidad, idUsuario);

                resolve({ path });
            }
            catch (error) {
                reject(new ProcessError('Error procesando importacion', error));
            }
        });
    }

    async executeAlta(alta, idUsuario: number) {
        return new Promise(async (resolve, reject) => {
            try {
                const localStorage = getNamespace('LocalStorage');
                const token = localStorage.get("accessToken");
                const codigoEntidad = 'IMPORTADO_SUCERP';
                const detalleObservacion = 'Importado por proceso SUCERP';
                const entidad = 'Vehiculo';
                const idVehiculo = 0; //idVehiculo es simbolico, addImportacion agrega el id automaticamente
                
                for (let i = 0; i < alta.length; i++) {
                    try {
                        const itemAlta = alta[i];
                        const dominio = itemAlta.dominioNuevo.toString().trim();
                        const vehiculos = await this.vehiculoService.listByDatos(token, dominio, "") as Array<VehiculoRow>;

                        if (vehiculos.length > 1) {
                            const data = {
                                token: token,
                                idTipoAlerta: 30,
                                idUsuario: idUsuario,
                                fecha: getDateNow(true),
                                idModulo: 30,
                                origen: "laramie-importacion-webapi/services/import-sucerp/executeAlta",
                                mensaje: "Error Importación SUCERP",
                                data: {
                                    itemAlta: itemAlta,
                                    message: "Se encontraron patentes duplicadas"
                                }
                            };

                            await this.publishService.sendMessage("laramie-importacion-webapi/services/import-sucerp/executeBaja", "AddAlerta", idUsuario.toString(), data);
                            continue;
                        }

                        if (vehiculos.length > 0) {
                            //alerta de alta sobre vehiculo existente
                            const data = {
                                token: token,
                                idTipoAlerta: 30,
                                idUsuario: idUsuario,
                                fecha: getDateNow(true),
                                idModulo: 30,
                                origen: "laramie-importacion-webapi/services/import-sucerp/executeAlta",
                                mensaje: "Error Importación SUCERP",
                                data: {
                                    itemAlta: itemAlta,
                                    message: "Alta de vehículo existente"
                                }
                            };
                            await this.publishService.sendMessage("laramie-importacion-webapi/services/import-sucerp/executeAlta", "AddAlerta", idUsuario.toString(), data);

                            //solo actualizo el codigo MTM
                            const vehiculoBaja = vehiculos[0];
                            const vehiculoDTO = await this.vehiculoService.findById(token, vehiculoBaja.id) as VehiculoDTO;
                            vehiculoDTO.vehiculo.codigoMTM = itemAlta.codigoMTMFMM;
                            await this.vehiculoService.modifyImportacion(token, vehiculoDTO.vehiculo.id, vehiculoDTO);

                            resolve({});
                            return;
                        }

                        const incisoVehiculos = await this.incisoVehiculoService.list(token) as Array<IncisoVehiculo>;
                        const incisoVehiculo = incisoVehiculos.find(f => f.codigoSucerp === itemAlta.incisoAdicional.toString().trim());

                        const categoriaVehiculos = await this.categoriaVehiculoService.list(token) as Array<CategoriaVehiculo>;
                        const categoriaVehiculo = categoriaVehiculos.find(f => f.codigoSucerp === itemAlta.categoriaAdicional.toString().trim());

                        const usosVehiculo = await this.listaService.listByTipo(token, "FinalidadVehiculo") as Array<Lista>;
                        const usoVehiculo = usosVehiculo.find(f => f.codigo === itemAlta.codigoTipoUso.toString().trim())

                        let itemFechaAlta = itemAlta.fechaVigencia;
                        const anioFechaAlta = parseInt(itemFechaAlta.substring(0, 4));
                        const mesFechaAlta = parseInt(itemFechaAlta.substring(4, 6));
                        const diaFechaAlta = parseInt(itemFechaAlta.substring(6, 8));
                        const fechaAlta = new Date(anioFechaAlta, mesFechaAlta-1, diaFechaAlta, 0, 0, 0, 0);

                        let origenesFabricacionSucerp = itemAlta.toString().trim();
                        let idOrigenFabricacion:number = null; 
                        switch (origenesFabricacionSucerp) {
                            case "11":
                                idOrigenFabricacion = 1150;
                                break;
                            default:
                                idOrigenFabricacion = null;
                                break;
                        }
                        const origenesFabricacion = await this.listaService.listByTipo(token, "OrigenFabricacion") as Array<Lista>;
                        const origenFabricacion = origenesFabricacion.find(f => f.id === idOrigenFabricacion);

                        let vehiculoDTO = new VehiculoDTO();
                        vehiculoDTO.cuenta.numeroCuenta = itemAlta.dominioNuevo;
                        vehiculoDTO.vehiculo.id = idVehiculo;
                        vehiculoDTO.vehiculo.idEstadoCarga = 20; //Incompleta
                        vehiculoDTO.vehiculo.idCuenta = vehiculoDTO.cuenta.id;
                        vehiculoDTO.vehiculo.dominio = itemAlta.dominioNuevo;
                        vehiculoDTO.vehiculo.dominioAnterior = itemAlta.dominioViejo;
                        vehiculoDTO.vehiculo.anioModelo = itemAlta.anio;
                        vehiculoDTO.vehiculo.marca = itemAlta.marca;
                        vehiculoDTO.vehiculo.codigoMTM = itemAlta.codigoMTMFMM;
                        vehiculoDTO.vehiculo.modelo = itemAlta.modelo;
                        vehiculoDTO.vehiculo.idIncisoVehiculo = (incisoVehiculo) ? incisoVehiculo.id : null;
                        vehiculoDTO.vehiculo.idCategoriaVehiculo = (categoriaVehiculo) ? categoriaVehiculo.id : null;
                        vehiculoDTO.vehiculo.valuacion = parseFloat(itemAlta.valuacion);
                        vehiculoDTO.vehiculo.peso = itemAlta.peso;
                        vehiculoDTO.vehiculo.carga = itemAlta.carga;
                        vehiculoDTO.vehiculo.cilindrada = itemAlta.cilindrada;
                        vehiculoDTO.vehiculo.idOrigenFabricacion = (origenFabricacion) ? origenFabricacion.id : null;
                        vehiculoDTO.vehiculo.idUsoVehiculo = (usoVehiculo) ? usoVehiculo.id : null;
                        vehiculoDTO.vehiculo.fechaAlta = fechaAlta;

                        for (let t = 0; t < alta[i].titulares.length; t++) {
                            const titular = alta[i].titulares[t];
                            const persona = await this.getPersonaSucerp(token, titular) as Persona;
                            if (!persona) {
                                const data = {
                                    token: token,
                                    idTipoAlerta: 30,
                                    idUsuario: idUsuario,
                                    fecha: getDateNow(true),
                                    idModulo: 30,
                                    origen: "laramie-importacion-webapi/services/import-sucerp/executeAlta",
                                    mensaje: "Error Importación SUCERP",
                                    data: {
                                        itemAlta: itemAlta,
                                        message: "No se pudo procesar el titular"
                                    }
                                };

                                await this.publishService.sendMessage("laramie-importacion-webapi/services/import-sucerp/executeAlta", "AddAlerta", idUsuario.toString(), data);
                                continue;
                            }

                            const porcentajeCondominio = parseFloat(titular.porcentajeTitularidad);
                            const idTipoVinculoVehiculoTitular = 71; //TITULAR (Vehiculos)
                            vehiculoDTO.vinculosVehiculo.push(new VinculoVehiculoState(0, idVehiculo, idTipoVinculoVehiculoTitular, persona.id, persona.idTipoPersona, persona.idTipoDocumento, persona.numeroDocumento, persona.nombrePersona, 0, null, null, porcentajeCondominio, "a"));
                        }

                        // se agrega etiqueta
                        vehiculoDTO.etiquetas.push(new EtiquetaState(0, entidad, idVehiculo, codigoEntidad, 'a'));  

                        // se agrega observacion
                        vehiculoDTO.observaciones.push(new ObservacionState(0, entidad, idVehiculo, detalleObservacion, idUsuario, getDateNow(true), 'a'))

                        await this.vehiculoService.addImportacion(token, vehiculoDTO) as VehiculoDTO;
                    }
                    catch (error) {
                        const data = {
                            token: token,
                            idTipoAlerta: 30,
                            idUsuario: idUsuario,
                            fecha: getDateNow(true),
                            idModulo: 30,
                            origen: "laramie-importacion-webapi/services/import-sucerp/executeAlta",
                            mensaje: "Error Importación SUCERP",
                            data: {
                                alta: alta[i],
                                error: castPublicError(error),
                                message: "Error al procesar el alta"
                            }
                        };
                        await this.publishService.sendMessage("laramie-importacion-webapi/services/import-sucerp/executeAlta", "AddAlerta", idUsuario.toString(), data);
                    }
                }

                resolve({});
            }
            catch (error) {
                reject(new ProcessError('Error procesando importacion', error));
            }
        });
    }

    async executeBaja(baja, idUsuario: number) {
        return new Promise(async (resolve, reject) => {
            try {
                const localStorage = getNamespace('LocalStorage');
                const token = localStorage.get("accessToken");
                const codigoEntidad = 'BAJA_SUCERP';
                const detalleObservacion = 'Baja por proceso SUCERP';
                const entidad = 'Vehiculo';
                let idVehiculo = 0;

                for (let i = 0; i < baja.length; i++) {
                    try {
                        const itemBaja = baja[i];
                        const dominio = itemBaja.dominioNuevo;
                        const vehiculos = await this.vehiculoService.listByDatos(token, dominio, "") as Array<VehiculoRow>;

                        if (vehiculos.length === 0) {
                            const data = {
                                token: token,
                                idTipoAlerta: 30,
                                idUsuario: idUsuario,
                                fecha: getDateNow(true),
                                idModulo: 30,
                                origen: "laramie-importacion-webapi/services/import-sucerp/executeBaja",
                                mensaje: "Error Importación SUCERP",
                                data: {
                                    itemBaja: itemBaja,
                                    message: "No se encontró la patente"
                                }
                            };

                            await this.publishService.sendMessage("laramie-importacion-webapi/services/import-sucerp/executeBaja", "AddAlerta", idUsuario.toString(), data);
                            continue;
                        }
                        if (vehiculos.length > 1) {
                            const data = {
                                token: token,
                                idTipoAlerta: 30,
                                idUsuario: idUsuario,
                                fecha: getDateNow(true),
                                idModulo: 30,
                                origen: "laramie-importacion-webapi/services/import-sucerp/executeBaja",
                                mensaje: "Error Importación SUCERP",
                                data: {
                                    itemBaja: itemBaja,
                                    message: "Se encontraron patentes duplicadas"
                                }
                            };

                            await this.publishService.sendMessage("laramie-importacion-webapi/services/import-sucerp/executeBaja", "AddAlerta", idUsuario.toString(), data);
                            continue;
                        }
                        idVehiculo = vehiculos[0].id;

                        const vehiculoDTO = await this.vehiculoService.findById(token, idVehiculo) as VehiculoDTO;
                        if (vehiculoDTO.vehiculo.idMotivoBajaVehiculo) {
                            const data = {
                                token: token,
                                idTipoAlerta: 30,
                                idUsuario: idUsuario,
                                fecha: getDateNow(true),
                                idModulo: 30,
                                origen: "laramie-importacion-webapi/services/import-sucerp/executeBaja",
                                mensaje: "Error Importación SUCERP",
                                data: {
                                    itemBaja: itemBaja,
                                    message: "El vehículo ya se encuentra dado de baja"
                                }
                            };

                            await this.publishService.sendMessage("laramie-importacion-webapi/services/import-sucerp/executeBaja", "AddAlerta", idUsuario.toString(), data);
                            continue;
                        }

                        let itemFechaBaja = itemBaja.fechaVigencia;
                        const anioFechaBaja = parseInt(itemFechaBaja.substring(0, 4));
                        const mesFechaBaja = parseInt(itemFechaBaja.substring(4, 6));
                        const diaFechaBaja = parseInt(itemFechaBaja.substring(6, 8));
                        const fechaBaja = new Date(anioFechaBaja, mesFechaBaja-1, diaFechaBaja ,0, 0, 0, 0);

                        const motivosBaja = await this.listaService.listByTipo(token, "MotivoBajaVehiculo") as Array<Lista>;
                        const motivoBaja = motivosBaja.find(f => f.codigo === "S");

                        const codigoBajaProvisoria = (await this.configuracionService.findByNombre(token, "TipoCondicionEspecialCodigoBajaProvisoria") as Configuracion).valor;
                        const tipoCondicionEspecialBajaProvisoria = await this.tipoCondicionEspecialService.findByCodigo(token, codigoBajaProvisoria) as TipoCondicionEspecial;

                        vehiculoDTO.vehiculo.fechaBaja = fechaBaja;
                        vehiculoDTO.vehiculo.idMotivoBajaVehiculo = motivoBaja.id;
                        vehiculoDTO.condicionesEspeciales.push(new CondicionEspecialState(0, vehiculoDTO.cuenta.id, tipoCondicionEspecialBajaProvisoria.id, getDateNow(false), null, "a"));

                        // se agrega etiqueta
                        vehiculoDTO.etiquetas.push(new EtiquetaState(0, entidad, idVehiculo, codigoEntidad, 'a'));  

                        // se agrega observacion
                        vehiculoDTO.observaciones.push(new ObservacionState(0, entidad, idVehiculo, detalleObservacion, idUsuario, getDateNow(true), 'a'))

                        await this.vehiculoService.modifyImportacion(token, vehiculoDTO.vehiculo.id, vehiculoDTO);
                    }
                    catch (error) {
                        const data = {
                            token: token,
                            idTipoAlerta: 30,
                            idUsuario: idUsuario,
                            fecha: getDateNow(true),
                            idModulo: 30,
                            origen: "laramie-importacion-webapi/services/import-sucerp/executeBaja",
                            mensaje: "Error Importación SUCERP",
                            data: {
                                baja: baja,
                                error: castPublicError(error),
                                message: "Error al procesar la baja"
                            }
                        };

                        await this.publishService.sendMessage("laramie-importacion-webapi/services/import-sucerp/executeBaja", "AddAlerta", idUsuario.toString(), data);
                    }
                }

                resolve({});
            }
            catch (error) {
                reject(new ProcessError('Error procesando importacion', error));
            }
        });
    }

    async executePago(impuesto, idUsuario: number, numeroEnvio:string, fechaEnvio:Date, path:string) {
        return new Promise(async (resolve, reject) => {
            try {
                const localStorage = getNamespace('LocalStorage');
                const token = localStorage.get("accessToken");
                const today = getDateNow(true);
                const tipoTributos = await this.listaService.listByTipo(token, "TipoTributo") as Lista[];

                const lote = new RecaudacionLoteDto();
                lote.codigoRecaudadora = this.codigoRecaudadoraSucerp;
                lote.nombre = numeroEnvio;
                lote.path = path;
                const recaudacionLote = lote.recaudacionLote = new RecaudacionLote();
                const recaudaciones = lote.recaudaciones as Recaudacion[];

                recaudacionLote.fechaLote = fechaEnvio;
                recaudacionLote.idUsuarioProceso = idUsuario;
                recaudacionLote.fechaProceso = today;
                recaudacionLote.fechaAcreditacion = null; //no se puede determinar en este lote

                for (let i = 0; i < impuesto.length; i++) {
                    const itemImpuesto = impuesto[i];
                    try {
                        const dominio = itemImpuesto.dominioNuevo;

                        const vehiculos = await this.vehiculoService.listByDatos(token, dominio, "") as Array<VehiculoRow>;
                        if (vehiculos.length === 0) {
                            const data = {
                                token: token,
                                idTipoAlerta: 30,
                                idUsuario: idUsuario,
                                fecha: getDateNow(true),
                                idModulo: 30,
                                origen: "laramie-importacion-webapi/services/import-sucerp/executePago",
                                mensaje: "Error Importación SUCERP",
                                data: {
                                    itemImpuesto: itemImpuesto,
                                    message: "No se encontró la patente"
                                }
                            };

                            await this.publishService.sendMessage("laramie-importacion-webapi/services/import-sucerp/executePago", "AddAlerta", idUsuario.toString(), data);
                            continue;
                        }
                        if (vehiculos.length > 1) {
                            const data = {
                                token: token,
                                idTipoAlerta: 30,
                                idUsuario: idUsuario,
                                fecha: getDateNow(true),
                                idModulo: 30,
                                origen: "laramie-importacion-webapi/services/import-sucerp/executePago",
                                mensaje: "Error Importación SUCERP",
                                data: {
                                    itemImpuesto: itemImpuesto,
                                    message: "Existe más de un registro para la misma patente"
                                }
                            };

                            await this.publishService.sendMessage("laramie-importacion-webapi/services/import-sucerp/executePago", "AddAlerta", idUsuario.toString(), data);
                            continue;
                        }

                        const vehiculoPago = vehiculos[0];

                        //#region datos deuda
                        const periodo = itemImpuesto.periodo;
                        const cuota = parseInt(itemImpuesto.numeroCuota);
                        const fechaCobro = this.parseDateSucerp(itemImpuesto.fechaCobro);
                        const importeCobro = parseFloat(itemImpuesto.importeTotal);
                        if (!isValidNumber(itemImpuesto.reservado, true)) {
                            const data = {
                                token: token,
                                idTipoAlerta: 30,
                                idUsuario: idUsuario,
                                fecha: getDateNow(true),
                                idModulo: 30,
                                origen: "laramie-importacion-webapi/services/import-sucerp/executePago",
                                mensaje: "No se pudo obtener los datos del campo reservado (numeroPartida)",
                                data: {
                                    itemImpuesto: itemImpuesto
                                }
                            };

                            await this.publishService.sendMessage("laramie-importacion-webapi/services/import-sucerp/executePago", "AddAlerta", idUsuario.toString(), data);
                            continue;
                        }
                        const numeroPartida = parseInt(itemImpuesto.reservado);
                        //#endregion

                        //#region recibo
                        const cuentaCorrienteItems = await this.cuentaCorrienteItemService.listByPartida(token, numeroPartida) as CuentaCorrienteItemDeuda[];
                        const cuentaCorrienteItem = cuentaCorrienteItems.find(f => f.tasaCabecera);
                        if (!cuentaCorrienteItem) {
                            const data = {
                                token: token,
                                idTipoAlerta: 30,
                                idUsuario: idUsuario,
                                fecha: getDateNow(true),
                                idModulo: 30,
                                origen: "laramie-importacion-webapi/services/import-sucerp/executePago",
                                mensaje: "Error Importación SUCERP",
                                data: {
                                    itemImpuesto: itemImpuesto,
                                    message: "No se pudo detectar la deuda"
                                }
                            };

                            await this.publishService.sendMessage("laramie-importacion-webapi/services/import-sucerp/executePago", "AddAlerta", idUsuario.toString(), data);
                            continue;
                        }
                        const cuentaCorrienteItemRecibo = new CuentaCorrienteItemRecibo();
                        cuentaCorrienteItemRecibo.idCuenta = cuentaCorrienteItem.idCuenta,
                        cuentaCorrienteItemRecibo.idTasa = cuentaCorrienteItem.idTasa,
                        cuentaCorrienteItemRecibo.idSubTasa = cuentaCorrienteItem.idSubTasa,
                        cuentaCorrienteItemRecibo.codigoDelegacion = cuentaCorrienteItem.codigoDelegacion,
                        cuentaCorrienteItemRecibo.numeroMovimiento = cuentaCorrienteItem.numeroMovimiento,
                        cuentaCorrienteItemRecibo.numeroPartida = cuentaCorrienteItem.numeroPartida,
                        cuentaCorrienteItemRecibo.periodo = cuentaCorrienteItem.periodo,
                        cuentaCorrienteItemRecibo.cuota = cuentaCorrienteItem.cuota
                        const result:any = await this.cuentaCorrienteItemService.addReciboComun(token, vehiculoPago.idCuenta, fechaCobro, cuentaCorrienteItemRecibo, true);
                        //#endregion

                        const cuentaPago = await this.cuentaPagoService.findById(token, result.idCuentaPago) as CuentaPago;
                        const cuenta = await this.cuentaService.findById(token, cuentaPago.idCuenta) as Cuenta;
                        const tipoTributo = tipoTributos.find(f => f.id === cuenta.idTipoTributo);                      

                        //#region recaudacion
                        const recaudacion = new Recaudacion();
                        recaudacion.numeroControl = `${dominio}/${itemImpuesto.numeroTramite}`;
                        recaudacion.numeroComprobante = '';
                        recaudacion.codigoTipoTributo = tipoTributo.codigo;
                        recaudacion.numeroCuenta = cuenta.numeroCuenta;
                        recaudacion.codigoDelegacion = cuentaPago.codigoDelegacion;
                        recaudacion.numeroRecibo = cuentaPago.numeroRecibo;
                        recaudacion.fechaCobro = cuentaPago.fechaVencimiento1;
                        recaudacion.importeCobro = importeCobro;
                        recaudacion.codigoBarras = cuentaPago.codigoBarras;
                        recaudacion.observacion = itemImpuesto.observaciones;

                        recaudaciones.push(recaudacion);
                        recaudacionLote.casos++;
                        recaudacionLote.importeTotal += importeCobro;
                        //#endregion
                    }
                    catch (error) {
                        const data = {
                            token: token,
                            idTipoAlerta: 30,
                            idUsuario: idUsuario,
                            fecha: getDateNow(true),
                            idModulo: 30,
                            origen: "laramie-importacion-webapi/services/import-sucerp/executePago",
                            mensaje: "Error Importación SUCERP",
                            data: {
                                cuota: itemImpuesto,
                                error: castPublicError(error),
                                message: "Error al procesar el pago"
                            }
                        };

                        await this.publishService.sendMessage("laramie-importacion-webapi/services/import-sucerp/executePago", "AddAlerta", idUsuario.toString(), data);
                    }
                }

                if (recaudaciones.length > 0) {
                    await this.publishService.sendMessage("laramie-importacion-webapi/services/import-sucerp/executePago", "AddRecaudacionIngresosPublicos", idUsuario.toString(), lote);
                }

                resolve({});
            }
            catch (error) {
                reject(new ProcessError('Error procesando importacion', error));
            }
        });
    }

    async executeCambioTitularidad(cambio, idUsuario: number) {
        return new Promise(async (resolve, reject) => {
            try {
                const localStorage = getNamespace('LocalStorage');
                const token = localStorage.get("accessToken");
                const detalleObservacion = `Actualización de cambio de titularidad por proceso SUCERP - ${getDateToString(getDateNow(true), true)}`;
                const entidad = 'Vehiculo';
                let idVehiculo = 0;
                
                const idTipoVinculoVehiculoTitular = 71; //TITULAR (Vehiculos)
                const idTipoVinculoVehiculoTitularAnterior = 656; //TITULAR ANTERIOR (Vehiculos)

                for (let i = 0; i < cambio.length; i++) {
                    try {
                        const itemCambio = cambio[i];
                        const dominio = itemCambio.dominioNuevo.toString().trim();
                        const vehiculos = await this.vehiculoService.listByDatos(token, dominio, "") as Array<VehiculoRow>;

                        if (vehiculos.length > 1) {
                            const data = {
                                token: token,
                                idTipoAlerta: 30,
                                idUsuario: idUsuario,
                                fecha: getDateNow(true),
                                idModulo: 30,
                                origen: "laramie-importacion-webapi/services/import-sucerp/executeCambioTitularidad",
                                mensaje: "Error Importación SUCERP",
                                data: {
                                    itemBaja: itemCambio,
                                    message: "Se encontraron patentes duplicadas"
                                }
                            };

                            await this.publishService.sendMessage("laramie-importacion-webapi/services/import-sucerp/executeCambioTitularidad", "AddAlerta", idUsuario.toString(), data);
                            continue;
                        }
                        if (vehiculos.length === 0) {
                            const data = {
                                token: token,
                                idTipoAlerta: 30,
                                idUsuario: idUsuario,
                                fecha: getDateNow(true),
                                idModulo: 30,
                                origen: "laramie-importacion-webapi/services/import-sucerp/executeCambioTitularidad",
                                mensaje: "Error Importación SUCERP",
                                data: {
                                    itemBaja: itemCambio,
                                    message: "Vehículo inexistente"
                                }
                            };
                            
                            await this.publishService.sendMessage("laramie-importacion-webapi/services/import-sucerp/executeCambioTitularidad", "AddAlerta", idUsuario.toString(), data);
                            continue;
                        }
                        idVehiculo = vehiculos[0].id;

                        const vehiculoDTO = await this.vehiculoService.findById(token, idVehiculo) as VehiculoDTO;

                        //actualizo titulares (actuales y nuevos)
                        const idsVinculosTitular:number[] = [0];
                        for (let t = 0; t < cambio[i].titulares.length; t++) {
                            const titular = cambio[i].titulares[t];
                            if (titular.tipoTitular === "N") { //solo proceso los nuevos
                                const persona = await this.getPersonaSucerp(token, titular) as Persona;
                                if (!persona) {
                                    const data = {
                                        token: token,
                                        idTipoAlerta: 30,
                                        idUsuario: idUsuario,
                                        fecha: getDateNow(true),
                                        idModulo: 30,
                                        origen: "laramie-importacion-webapi/services/import-sucerp/executeCambioTitularidad",
                                        mensaje: "Error Importación SUCERP",
                                        data: {
                                            itemCambio: itemCambio,
                                            message: "No se pudo procesar el titular"
                                        }
                                    };

                                    await this.publishService.sendMessage("laramie-importacion-webapi/services/import-sucerp/executeCambioTitularidad", "AddAlerta", idUsuario.toString(), data);
                                    continue;
                                }
                                const porcentajeCondominio = parseFloat(titular.porcentajeTitularidad);

                                const vinculoTitular = vehiculoDTO.vinculosVehiculo.find(f => f.idTipoDocumento === persona.idTipoDocumento && f.numeroDocumento === persona.numeroDocumento);
                                if (vinculoTitular) {
                                    if (vinculoTitular.idTipoVinculoVehiculo === idTipoVinculoVehiculoTitular) { //ya es titular
                                        if (vinculoTitular.porcentajeCondominio !== porcentajeCondominio) {
                                            vinculoTitular.porcentajeCondominio = porcentajeCondominio;
                                            vinculoTitular.state = "m"; //cambio su porcentaje
                                        }
                                        idsVinculosTitular.push(vinculoTitular.id); //sigue siendo titular
                                    }
                                    else {
                                        vinculoTitular.idTipoVinculoVehiculo = idTipoVinculoVehiculoTitular;
                                        vinculoTitular.porcentajeCondominio = porcentajeCondominio;
                                        vinculoTitular.state = "m";
                                        idsVinculosTitular.push(vinculoTitular.id); //ahora es titular
                                    }
                                }
                                else {
                                    //nuevo titular
                                    vehiculoDTO.vinculosVehiculo.push(new VinculoVehiculoState(0, idVehiculo, idTipoVinculoVehiculoTitular, persona.id, persona.idTipoPersona, persona.idTipoDocumento, persona.numeroDocumento, persona.nombrePersona, 0, null, null, porcentajeCondominio, "a"));
                                }
                            }
                        }

                        //actualizo titulares dados de baja
                        vehiculoDTO.vinculosVehiculo.filter(f => f.idTipoVinculoVehiculo === idTipoVinculoVehiculoTitular && !idsVinculosTitular.includes(f.id))
                        .forEach(vinculoTitularAnterior => {
                            vinculoTitularAnterior.idTipoVinculoVehiculo = idTipoVinculoVehiculoTitularAnterior;
                            vinculoTitularAnterior.porcentajeCondominio = 0;
                            vinculoTitularAnterior.state = "m"; //ahora ya no es mas titular
                        });

                        // se agrega observacion
                        vehiculoDTO.observaciones.push(new ObservacionState(0, entidad, idVehiculo, detalleObservacion, idUsuario, getDateNow(true), 'a'))

                        await this.vehiculoService.modifyImportacion(token, idVehiculo, vehiculoDTO) as VehiculoDTO;
                    }
                    catch (error) {
                        const data = {
                            token: token,
                            idTipoAlerta: 30,
                            idUsuario: idUsuario,
                            fecha: getDateNow(true),
                            idModulo: 30,
                            origen: "laramie-importacion-webapi/services/import-sucerp/executeCambioTitularidad",
                            mensaje: "Error Importación SUCERP",
                            data: {
                                cambio: cambio[i],
                                error: castPublicError(error),
                                message: "Error al procesar el cambio de titularidad"
                            }
                        };
                        await this.publishService.sendMessage("laramie-importacion-webapi/services/import-sucerp/executeCambioTitularidad", "AddAlerta", idUsuario.toString(), data);
                    }
                }

                resolve({});
            }
            catch (error) {
                reject(new ProcessError('Error procesando importacion', error));
            }
        });
    }

    async executeCambioRadicacion() {
        return new Promise(async (resolve, reject) => {
            try {
                resolve({});
            }
            catch (error) {
                reject(new ProcessError('Error procesando importacion', error));
            }
        });
    }

    //funciones auxiliares

    private async getPersonaSucerp(token:string, titular:any) {
        let numeroDocumentoTitular = titular.numeroDocumento;
        let nombreTitular = titular.nombreTitular;
        let tipoDocumentoSucerp = titular.tipoDocumento;

        const idTipoPersona = this.getTipoPersona(tipoDocumentoSucerp);
        const idTipoDocumentoTitular = this.getTipoDocumento(tipoDocumentoSucerp); 
        if (!idTipoDocumentoTitular) return null;

        let persona = await this.personaService.findByDocumento(token, idTipoDocumentoTitular, numeroDocumentoTitular) as Persona;
        if (persona.idTipoDocumento === 0) {
            const provincia = this.provincias.find(f => f.codigo === parseInt(titular.provincia).toString());
            const data = {
                idPersona: 0,
                idTipoPersona: idTipoPersona,
                idTipoDocumento: idTipoDocumentoTitular !== 0 ? idTipoDocumentoTitular : 517, //517: SIN DOCUMENTO
                nombrePersona: nombreTitular,
                numeroDocumento: numeroDocumentoTitular,
                    numeroCUIT: titular.numeroCUIT,
                    calle: titular.calle,
                    numero: titular.numero,
                    piso: titular.piso,
                    departamento: titular.departamento,
                    barrio: titular.barrio,
                    localidad: titular.localidad,
                    codigoPostal: titular.codigoPostal,
                    idProvincia: (provincia) ? provincia.id : null,
                    idPais: (provincia) ? provincia.idPais : null
            };
            persona = await this.executeAddPersonaSucerp(token, data);
        }
        else {
            const personaDto = await this.personaService.findById(token, persona.idTipoPersona, persona.id) as any;
            const provincia = this.provincias.find(f => f.codigo === parseInt(titular.provincia).toString());
            const data = {
                idPersona: persona.id,
                idTipoPersona: persona.idTipoPersona,
                idTipoDocumento: persona.idTipoDocumento,
                nombrePersona: persona.nombrePersona,
                numeroDocumento: persona.numeroDocumento,
                    numeroCUIT: titular.numeroCUIT,
                    calle: titular.calle,
                    numero: titular.numero,
                    piso: titular.piso,
                    departamento: titular.departamento,
                    barrio: titular.barrio,
                    localidad: titular.localidad,
                    codigoPostal: titular.codigoPostal,
                    idProvincia: (provincia) ? provincia.id : null,
                    idPais: (provincia) ? provincia.idPais : null
            };

            let direccionPersona = null;
            if (persona.idTipoPersona === TIPO_PERSONA.FISICA) {
                direccionPersona = personaDto.direccion;
            }
            else if (persona.idTipoPersona === TIPO_PERSONA.JURIDICA) {
                direccionPersona = personaDto.domicilioLegal;
            }

            if (direccionPersona && this.cambioDireccion(data, direccionPersona)) {
                persona = await this.executeModifyPersonaSucerp(token, data, personaDto);
            }
        }

        return persona;
    }

    private async executeAddPersonaSucerp(token:string, data:any) {
        if (data.idTipoPersona === TIPO_PERSONA.FISICA) {
            let personaFisicaDTO = new PersonaFisicaDTO();

            personaFisicaDTO.persona.idTipoDocumento = data.idTipoDocumento;
            personaFisicaDTO.persona.numeroDocumento = data.numeroDocumento;
            personaFisicaDTO.persona.nombre = data.nombrePersona;
            personaFisicaDTO.persona.origen = "SUCERP";

            personaFisicaDTO.direccion.entidad = "PersonaFisica";
            personaFisicaDTO.direccion.codigoPostal = data.codigoPostal;
            personaFisicaDTO.direccion.calle = data.calle;
            personaFisicaDTO.direccion.altura = data.numero;
            personaFisicaDTO.direccion.piso = data.piso;
            personaFisicaDTO.direccion.dpto = data.departamento;
            personaFisicaDTO.direccion.idProvincia = data.idProvincia;
            personaFisicaDTO.direccion.idPais = data.idPais;
            personaFisicaDTO.direccion.idTipoGeoreferencia = 535; //carga directa
            personaFisicaDTO.direccion.origen = "SUCERP";

            personaFisicaDTO.documentos.push(new DocumentoState(-1, data.idTipoPersona, -1, data.idTipoDocumento, data.numeroDocumento, true, 'a'));

            const dto = await this.personaService.addPersonaFisica(token, personaFisicaDTO) as PersonaFisicaDTO;
            if (dto)
                return new Persona(dto.persona.id, data.idTipoPersona, data.nombrePersona, data.idTipoDocumento, data.numeroDocumento);
            else
                return null;
        }
        else if (data.idTipoPersona === TIPO_PERSONA.JURIDICA) {
            let personaJuridicaDTO = new PersonaJuridicaDTO();

            personaJuridicaDTO.persona.idTipoDocumento = data.idTipoDocumento;
            personaJuridicaDTO.persona.numeroDocumento = data.numeroDocumento;
            personaJuridicaDTO.persona.nombreFantasia = data.nombrePersona;

            personaJuridicaDTO.domicilioLegal.entidad = "PersonaJuridicaDomicilioLegal";
            personaJuridicaDTO.domicilioLegal.codigoPostal = data.codigoPostal;
            personaJuridicaDTO.domicilioLegal.calle = data.calle;
            personaJuridicaDTO.domicilioLegal.altura = data.numero;
            personaJuridicaDTO.domicilioLegal.piso = data.piso;
            personaJuridicaDTO.domicilioLegal.dpto = data.departamento;
            personaJuridicaDTO.domicilioLegal.idProvincia = data.idProvincia;
            personaJuridicaDTO.domicilioLegal.idPais = data.idPais;
            personaJuridicaDTO.domicilioLegal.idTipoGeoreferencia = 535; //carga directa
            personaJuridicaDTO.domicilioLegal.origen = "SUCERP";

            personaJuridicaDTO.domicilioFiscal.entidad = "PersonaJuridicaDomicilioFiscal";
            personaJuridicaDTO.domicilioFiscal.codigoPostal = data.codigoPostal;
            personaJuridicaDTO.domicilioFiscal.calle = data.calle;
            personaJuridicaDTO.domicilioFiscal.altura = data.numero;
            personaJuridicaDTO.domicilioFiscal.piso = data.piso;
            personaJuridicaDTO.domicilioFiscal.dpto = data.departamento;
            personaJuridicaDTO.domicilioFiscal.idProvincia = data.idProvincia;
            personaJuridicaDTO.domicilioFiscal.idPais = data.idPais;
            personaJuridicaDTO.domicilioFiscal.idTipoGeoreferencia = 535; //carga directa
            personaJuridicaDTO.domicilioFiscal.origen = "SUCERP";

            personaJuridicaDTO.documentos.push(new DocumentoState(-1, data.idTipoPersona, -1, data.idTipoDocumento, data.numeroDocumento, true, 'a'));

            const dto = await this.personaService.addPersonaJuridica(token, personaJuridicaDTO) as PersonaJuridicaDTO;
            if (dto)
                return new Persona(dto.persona.id, data.idTipoPersona, data.nombrePersona, data.idTipoDocumento, data.numeroDocumento);
            else
                return null;
        }
    }

    private async executeModifyPersonaSucerp(token:string, data:any, personaDto:any) {
            const direccion = new Direccion();
            direccion.codigoPostal = data.codigoPostal;
            direccion.calle = data.calle;
            direccion.altura = data.numero;
            direccion.piso = data.piso;
            direccion.dpto = data.departamento;
            direccion.idProvincia = data.idProvincia;
            direccion.idPais = data.idPais;
            direccion.idTipoGeoreferencia = 535; //carga directa
            direccion.origen = "SUCERP";

        if (data.idTipoPersona === TIPO_PERSONA.FISICA) {
            const personaFisicaDTO = new PersonaFisicaDTO();
            personaFisicaDTO.setFromObject(personaDto);
            personaFisicaDTO.persona.origen = "SUCERP";

            direccion.entidad = "PersonaFisica";
            direccion.id = personaFisicaDTO.direccion.id;
            direccion.idEntidad = personaFisicaDTO.direccion.idEntidad;
            personaFisicaDTO.direccion = CloneObject(direccion);

            const dto = await this.personaService.modifyPersonaFisica(token, data.idPersona, personaFisicaDTO) as PersonaFisicaDTO;
            if (dto)
                return new Persona(dto.persona.id, data.idTipoPersona, data.nombrePersona, data.idTipoDocumento, data.numeroDocumento);
            else
                return null;
        }
        else if (data.idTipoPersona === TIPO_PERSONA.JURIDICA) {
            const personaJuridicaDTO = new PersonaJuridicaDTO();
            personaJuridicaDTO.setFromObject(personaDto);

            direccion.entidad = "PersonaJuridicaDomicilioLegal";
            direccion.id = personaJuridicaDTO.domicilioLegal.id;
            direccion.idEntidad = personaJuridicaDTO.domicilioLegal.idEntidad;
            personaJuridicaDTO.domicilioLegal = CloneObject(direccion);

            direccion.entidad = "PersonaJuridicaDomicilioFiscal";
            direccion.id = personaJuridicaDTO.domicilioFiscal.id;
            direccion.idEntidad = personaJuridicaDTO.domicilioFiscal.idEntidad;

            const dto = await this.personaService.modifyPersonaJuridica(token, data.idPersona, personaJuridicaDTO) as PersonaJuridicaDTO;
            if (dto)
                return new Persona(dto.persona.id, data.idTipoPersona, data.nombrePersona, data.idTipoDocumento, data.numeroDocumento);
            else
                return null;
        }
    }

    private cambioDireccion(direccionSucerp:any, direccionPersona:Direccion) {
        if (direccionPersona.origen === "PORTAL_WEB") return false;

        const cambio = (
            direccionPersona.calle != direccionSucerp.calle ||
            direccionPersona.altura != direccionSucerp.numero ||
            direccionPersona.piso != direccionSucerp.piso ||
            direccionPersona.dpto != direccionSucerp.departamento ||
            direccionPersona.codigoPostal != direccionSucerp.codigoPostal ||
            direccionPersona.idProvincia != direccionSucerp.idProvincia
        );

        return cambio;
    }

    private parseDateSucerp(dateSucerp:string) {
        if (dateSucerp.indexOf('-') >= 0) {
            const year = parseInt(dateSucerp.substring(0,4));
            const month = parseInt(dateSucerp.substring(5,7));
            const day = parseInt(dateSucerp.substring(8,10));

            return new Date(year,month-1,day,0,0,0,0);
        }
        else {
            const year = parseInt(dateSucerp.substring(0,4));
            const month = parseInt(dateSucerp.substring(4,6));
            const day = parseInt(dateSucerp.substring(6,8));

            return new Date(year,month-1,day,0,0,0,0);
        }
    }

    private getTipoPersona(tipoDocumentoSucerp) {
        return (tipoDocumentoSucerp !== "0") ? 500 : 501;
    }

    private getTipoDocumento(tipoDocumentoSucerp){
        let idTipoDocumentoTitular = 0;

        switch (tipoDocumentoSucerp) {
            case "0": //C.U.I.T. (Juridica)
                idTipoDocumentoTitular = 515; //C.U.I.T.
                break;
            case "1": //D.N.I.
                idTipoDocumentoTitular = 510;
                break;
            case "2": //L.E.
                idTipoDocumentoTitular = 512;
                break;
            case "3": //L.C.
                idTipoDocumentoTitular = 513;
                break;
            case "4": //D.N.I. Ex.
                idTipoDocumentoTitular = 516; //EXTRANJEROS
                break;
            case "5": //Cédula Ex.
                idTipoDocumentoTitular = 516; //EXTRANJEROS
                break;
            case "6": //Pasaporte
                idTipoDocumentoTitular = 514;
                break;
            case "7": //No consta
                idTipoDocumentoTitular = 517; //SIN DOCUMENTO
                break;
            case "8": //Cédula
                idTipoDocumentoTitular = 511; //D.N.I.C.V.
                break;
            case "9": //C.U.I.T. (Fisica)
                idTipoDocumentoTitular = 515; //C.U.I.T.
                break;
            default:
                idTipoDocumentoTitular = null;
                break;
        }

        return idTipoDocumentoTitular;
    }

}