// Version Denuncias


import fs from 'fs';

import moment from 'moment';
import config from '../../../../server/configuration/config';
import ProcessError from '../../../../infraestructure/sdk/error/process-error';
import { DenunciaDTO } from "../../../dto/arba-vehiculo/denuncia-dto";
import { DeudaDTO } from "../../../dto/arba-vehiculo/deuda-dto";
// import { DeudaPeriodoDTO } from "../../../dto/arba-vehiculo/deuda-periodo-dto";
import { PropietarioDTO } from "../../../dto/arba-vehiculo/propietario-dto";
import { CoPropietarioDTO } from "../../../dto/arba-vehiculo/co-propietario-dto";
import { VehiculoFormalDTO } from "../../../dto/arba-vehiculo/vehiculo-formal-dto";
import PublishService from "../../publish-service";
import { castPublicError, getDateNow } from "../../../../infraestructure/sdk/utils/convert";
import { getNamespace } from "cls-hooked";
import { verifyAccessToken } from "../../../../server/authorization/token";
import ReferenceError from "../../../../infraestructure/sdk/error/reference-error";
import PersonaService from "../../persona-service";
import Persona from "../../../entities/persona";
import Provincia from "../../../entities/provincia";
import ProvinciaService from "../../provincia-service";
import { TIPO_PERSONA } from "../../../../infraestructure/sdk/consts/tipoPersona";
import PersonaFisicaDTO from "../../../dto/persona-fisica-dto";
import DocumentoState from "../../../dto/documento-state";
import PersonaJuridicaDTO from "../../../dto/persona-juridica-dto";
import VehiculoService from "../../vehiculo-service";
import VehiculoRow from "../../../dto/vehiculo-row";
import VehiculoDTO from "../../../dto/vehiculo-dto";
import IncisoVehiculo from "../../../entities/inciso-vehiculo";
import CategoriaVehiculo from "../../../entities/categoria-vehiculo";
import Lista from "../../../entities/lista";
import IncisoVehiculoService from "../../inciso-vehiculo-service";
import CategoriaVehiculoService from "../../categoria-vehiculo-service";
import TipoCondicionEspecialService from "../../tipo-condicion-especial-service";
import ListaService from "../../lista-service";
import VinculoVehiculoState from "../../../dto/vinculo-vehiculo-state";
import CuentaCorrienteItemService from "../../cuenta-corriente-item-service";
import EtiquetaState from '../../../dto/etiqueta-state';
import ObservacionState from '../../../dto/observacion-state';
import { ensureDirectoryExistence } from '../../../../infraestructure/sdk/utils/helper';
import { DeudaPeriodoArba } from '../../../dto/arba-vehiculo/deuda-periodo-arba';
import { DeudaMoratoriaArba } from '../../../dto/arba-vehiculo/deuda-moratoria-arba.';
import TipoVehiculoService from '../../tipo-vehiculo-service';
import TipoVehiculo from '../../../entities/tipo-vehiculo';

export default class ImportARBAVehiculo {

    IMPORT_ARBA_RABBIT_QUEUE = "laramie-importacion-webapi/services/import-arba-vehciculo";

    publishService: PublishService;
    personaService: PersonaService;
    provinciaService: ProvinciaService;
    vehiculoService: VehiculoService;
    tipoVehiculoService: TipoVehiculoService;
    incisoVehiculoService: IncisoVehiculoService;
    categoriaVehiculoService: CategoriaVehiculoService;
    tipoCondicionEspecialService: TipoCondicionEspecialService;
    cuentaCorrienteItemService: CuentaCorrienteItemService;
    listaService: ListaService;
    vehiculos: VehiculoDTO[];

    constructor(publishService: PublishService,
        personaService: PersonaService,
        provinciaService: ProvinciaService,
        vehiculoService: VehiculoService,
        tipoVehiculoService: TipoVehiculoService,
        incisoVehiculoService: IncisoVehiculoService,
        categoriaVehiculoService: CategoriaVehiculoService,
        tipoCondicionEspecialService: TipoCondicionEspecialService,
        cuentaCorrienteItemService: CuentaCorrienteItemService,
        listaService: ListaService) {
        this.publishService = publishService;
        this.personaService = personaService;
        this.provinciaService = provinciaService;
        this.vehiculoService = vehiculoService;
        this.tipoVehiculoService = tipoVehiculoService;
        this.incisoVehiculoService = incisoVehiculoService;
        this.categoriaVehiculoService = categoriaVehiculoService;
        this.tipoCondicionEspecialService = tipoCondicionEspecialService;
        this.cuentaCorrienteItemService = cuentaCorrienteItemService;
        this.listaService = listaService;
    }

    async import(formalPath: string, propietariosPath: string, denunciasPath: string, deudasPath: string, idUsuario: number) {
        return new Promise(async (resolve, reject) => {
            try {

                const pathFileSourceFormal = `${config.PATH.TEMP}${formalPath}`;
                const pathFileSourcePropietarios = `${config.PATH.TEMP}${propietariosPath}`;
                const pathFileSourceDenuncias = `${config.PATH.TEMP}${denunciasPath}`;
                const pathFileSourceDeudas = `${config.PATH.TEMP}${deudasPath}`;

                const localStorage = getNamespace('LocalStorage');
                const token = localStorage.get("accessToken");

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

                const data = {
                    token: token,
                    idTipoEvento: 22, //Interfaz
                    idUsuario: idUsuario,
                    fecha: getDateNow(true),
                    idModulo: 30,
                    origen: this.IMPORT_ARBA_RABBIT_QUEUE,
                    mensaje: "Importacion ARBA VEHICULO",
                    data: {
                        file_formal: formalPath,
                        file_propietarios: propietariosPath,
                        file_denuncias: denunciasPath,
                        file_deudas: deudasPath
                    }
                };

                await this.publishService.sendMessage(`${this.IMPORT_ARBA_RABBIT_QUEUE}`, "AddEvento", idUsuario.toString(), data);

                await this.parseVehiculos(formalPath, propietariosPath, denunciasPath, deudasPath, idUsuario);
                // await this.parseDeudas(deudasPath);
                // await this.parseDenuncias(denunciasPath);

                const pathFileTargetFormal = `${config.PATH.IMPORTS}${formalPath}`;
                ensureDirectoryExistence(pathFileTargetFormal);
                fs.rename(pathFileSourceFormal, pathFileTargetFormal, (err) => {
                    if (err) {
                        reject(new ProcessError('Error moviendo archivo', err));
                        return;
                    }
                });

                const pathFileTargetPropietarios = `${config.PATH.IMPORTS}${propietariosPath}`;
                ensureDirectoryExistence(pathFileTargetPropietarios);
                fs.rename(pathFileSourcePropietarios, pathFileTargetPropietarios, (err) => {
                    if (err) {
                        reject(new ProcessError('Error moviendo archivo', err));
                        return;
                    }
                });

                const pathFileTargetDenuncias = `${config.PATH.IMPORTS}${denunciasPath}`;
                ensureDirectoryExistence(pathFileTargetDenuncias);
                fs.rename(pathFileSourceDenuncias, pathFileTargetDenuncias, (err) => {
                    if (err) {
                        reject(new ProcessError('Error moviendo archivo', err));
                        return;
                    }
                });

                const pathFileTargetDeudas = `${config.PATH.IMPORTS}${deudasPath}`;
                ensureDirectoryExistence(pathFileTargetDeudas);
                fs.rename(pathFileSourceDeudas, pathFileTargetDeudas, (err) => {
                    if (err) {
                        reject(new ProcessError('Error moviendo archivo', err));
                        return;
                    }
                });

                resolve({ formalPath, propietariosPath, denunciasPath, deudasPath });
            }
            catch (error) {
                reject(new ProcessError('Error procesando importacion', error));
            }
        });
    }

    private async parseVehiculos(formalPath: string, propietariosPath: string, denunciasPath: string, deudasPath: string, idUsuario: number) {
        return new Promise(async (resolve, reject) => {
            try {
                const { userId, token } = this.extractTokenAndUserId();
                const codigoEntidad = 'IMPORTADO_ARBA_VEHICULO';
                const detalleObservacion = 'Importado por proceso ARBA VEHICULO';
                const entidad = 'Vehiculo';
                const idVehiculo = 0; //idVehiculo es simbolico, addImportacion agrega el id automaticamente

                const propietarios: PropietarioDTO[] = await this.parsePropietariosFile(propietariosPath);
                const vehiculos: VehiculoFormalDTO[] = await this.parseFileRows(formalPath, () => new VehiculoFormalDTO());
                const denuncias: DenunciaDTO[] = await this.parseFileRows(denunciasPath, () => new DenunciaDTO());
                const deudas: DeudaDTO[] = await this.parseDeudasFile(deudasPath);

                const provincias = await this.provinciaService.list(token) as Provincia[];
                const tipoVehiculos = await this.tipoVehiculoService.list(token) as TipoVehiculo[];
                const incisoVehiculos = await this.incisoVehiculoService.list(token) as IncisoVehiculo[];
                const categoriaVehiculos = await this.categoriaVehiculoService.list(token) as CategoriaVehiculo[];
                const usosVehiculo = await this.listaService.listByTipo(token, "FinalidadVehiculo") as Lista[];

                for (let i = 0; i < vehiculos.length; i++) {
                    try {
                        const vehiculo = vehiculos[i];
                        const savedVehiculos: VehiculoRow[] = (vehiculo.dominio.length > 0) ? await this.vehiculoService.listByDatos(token, vehiculo.dominio, "") as VehiculoRow[] : [];
                        if (savedVehiculos.length > 0) {
                            const data = {
                                token,
                                idTipoAlerta: 30,
                                idUsuario: userId,
                                fecha: getDateNow(true),
                                idModulo: 30,
                                origen: `${this.IMPORT_ARBA_RABBIT_QUEUE}/parseVehiculos`,
                                mensaje: "Error Importación ARBA VEHICULO",
                                data: {
                                    item: vehiculo,
                                    message: "El vehículo ya existe"
                                }
                            };

                            await this.publishService.sendMessage(`${this.IMPORT_ARBA_RABBIT_QUEUE}/parseVehiculos`, "AddAlerta", userId.toString(), data);
                        }
                        else {
                            let vehiculoDTO = new VehiculoDTO();
                            vehiculoDTO.vehiculo.idEstadoCarga = 20; // Incompleta

                            let tipoCombustible = vehiculo.tipoCombustible;
                            let idTipoCombustible: number = 0;
                            switch (tipoCombustible) {
                                case '1':
                                    idTipoCombustible = 1140;
                                    break;
                                case '2':
                                    idTipoCombustible = 1141;
                                    break;
                                case '3':
                                    idTipoCombustible = 1142;
                                    break;
                                case '4':
                                    idTipoCombustible = 1143;
                                    break;
                                default:
                                    idTipoCombustible = null;
                                    break;
                            }

                            let origenFabricacion = vehiculo.nacionalidad;
                            let idTipoOrigenFabricacion:number = 0; 
                            switch (origenFabricacion) {
                                case '1':
                                    idTipoOrigenFabricacion = 1130;
                                    break;
                                case '2':
                                    idTipoOrigenFabricacion = 1131;
                                    break;
                                default:
                                    idTipoOrigenFabricacion = null;
                                    break;
                            }

                            const incisoVehiculo = incisoVehiculos.find(f => f.codigo === vehiculo.inciso);
                            const categoriaVehiculo = categoriaVehiculos.find(f => f.codigo === vehiculo.categoria.toString());
                            const usoVehiculo = usosVehiculo.find(f => f.codigo === vehiculo.usoVehiculo.toString());
                            const tipoVehiculo = tipoVehiculos.find(f => f.codigo === vehiculo.tipoVehiculo.toString());

                            //#region datos_vehiculo
                            vehiculoDTO.cuenta.numeroCuenta = vehiculo.dominio;
                            vehiculoDTO.vehiculo.dominioAnterior = vehiculo.dominioAnterior;
                            vehiculoDTO.vehiculo.dominio = vehiculo.dominio;
                            vehiculoDTO.vehiculo.fechaDDJJ = moment(vehiculo.fechaUltimaDDJJ, "YYYYMMDD").toDate();
                            vehiculoDTO.vehiculo.fechaAlta = moment(vehiculo.fechaAlta, "YYYYMMDD").toDate();
                            vehiculoDTO.vehiculo.anioModelo = vehiculo.anioModelo;
                            vehiculoDTO.vehiculo.codigoMarca = vehiculo.codigoMarca;
                            vehiculoDTO.vehiculo.fechaBaja = moment(vehiculo.fechaBaja, "YYYYMMDD").toDate();
                            vehiculoDTO.vehiculo.idTipoVehiculo = (tipoVehiculo) ? tipoVehiculo.id : null;
                            vehiculoDTO.vehiculo.peso = vehiculo.peso;
                            vehiculoDTO.vehiculo.carga = vehiculo.carga;
                            vehiculoDTO.vehiculo.marca = vehiculo.marca;
                            vehiculoDTO.vehiculo.modelo = vehiculo.modelo;
                            vehiculoDTO.vehiculo.marcaMotor = vehiculo.marcaMotor;
                            vehiculoDTO.vehiculo.serieMotor = vehiculo.serieMotor;
                            vehiculoDTO.vehiculo.numeroMotor = vehiculo.nroMotor;
                            vehiculoDTO.vehiculo.idCombustible = idTipoCombustible;
                            vehiculoDTO.vehiculo.numeroChasis = vehiculo.nroChasis;
                            vehiculoDTO.vehiculo.anioModelo = vehiculo.anioModelo;
                            vehiculoDTO.vehiculo.idIncisoVehiculo = (incisoVehiculo) ? incisoVehiculo.id : null;
                            vehiculoDTO.vehiculo.idCategoriaVehiculo = (categoriaVehiculo) ? categoriaVehiculo.id : null;
                            vehiculoDTO.vehiculo.idUsoVehiculo = (usoVehiculo) ? usoVehiculo.id : null;
                            vehiculoDTO.vehiculo.idOrigenFabricacion = idTipoOrigenFabricacion;
                            vehiculoDTO.vehiculo.fechaPatentamiento = moment(vehiculo.fechaTributacion, "YYYYMMDD").toDate();
                            vehiculoDTO.vehiculo.idMotivoBajaVehiculo = 1;
                            vehiculoDTO.vehiculo.valuacion = vehiculo.baseImponible;
                            vehiculoDTO.vehiculo.recupero = vehiculo.codigoRecupero;
                            //#endregion
                            
                            const propietariosPorVehiculo = propietarios.filter(f => f.dominio === vehiculo.dominio);
                            if (propietariosPorVehiculo.length === 0) {
                                const data = {
                                    token: token,
                                    idTipoAlerta: 30,
                                    idUsuario: idUsuario,
                                    fecha: getDateNow(true),
                                    idModulo: 30,
                                    rigen: `${this.IMPORT_ARBA_RABBIT_QUEUE}/parseVehiculos`,
                                    mensaje: "Error Importación ARBA VEHICULO",
                                    data: {
                                        item: vehiculo,
                                        message: "No se encontraron propietarios por vehículo"
                                    }
                                };

                                await this.publishService.sendMessage(`${this.IMPORT_ARBA_RABBIT_QUEUE}/parseVehiculos`, "AddAlerta", userId.toString(), data);
                                continue;
                            }
                            const copropietarios = propietariosPorVehiculo[0].coPropietarios;
                            for (const copropietario of copropietarios) {
                                const idTipoDocumentoTitular = this.getIdTipoDocumento(copropietario.tipoDocumento);

                                let persona: Persona = null;
                                if (idTipoDocumentoTitular) {
                                    persona = await this.personaService.findByDocumento(token, idTipoDocumentoTitular, copropietario.nroDocumento) as Persona;
                                }
                                if (persona && persona.idTipoDocumento === 0) {
                                    const provincia = provincias.find(f => f.codigo === "01"); // Buenos Aires (es ARBA)
                                    const data = {
                                        idCuenta: vehiculoDTO.cuenta.id,
                                        idTipoPersona: idTipoDocumentoTitular !== 0 ? 500 : 501, // 500: PersonaFisica, 501: PersonaJuridica
                                        // idTipoDocumento: idTipoDocumentoTitular !== 0 ? 510 : 512,
                                        idTipoDocumento: idTipoDocumentoTitular,
                                        nombrePersona: copropietario.nombreYApellido,
                                        numeroDocumento: copropietario.nroDocumento,
                                        numeroCUIT: copropietario.cuit,
                                        calle: copropietario.calle,
                                        numero: copropietario.numero,
                                        piso: copropietario.piso,
                                        departamento: copropietario.departamento,
                                        barrio: '',
                                        localidad: copropietario.localidad,
                                        codigoPostal: copropietario.codigoPostal,
                                        idProvincia: (provincia) ? provincia.id : null,
                                        idPais: (provincia) ? provincia.idPais : null
                                    };
                                    persona = await this.executeAddPersona(token, data);
                                }

                                if (persona) {
                                    const idTipoVinculoVehiculoTitular = 71; //TITULAR (Vehiuclos)
                                    vehiculoDTO.vinculosVehiculo.push(new VinculoVehiculoState(0, vehiculoDTO.vehiculo.id, idTipoVinculoVehiculoTitular, persona.id, persona.idTipoPersona, persona.idTipoDocumento, persona.numeroDocumento, persona.nombrePersona, 0, null, null, 0, "a"));
                                }
                                else {
                                    const data = {
                                        token: token,
                                        idTipoAlerta: 30,
                                        idUsuario: idUsuario,
                                        fecha: getDateNow(true),
                                        idModulo: 30,
                                        origen: `${this.IMPORT_ARBA_RABBIT_QUEUE}/parsePropietarios`,
                                        mensaje: "Error Importación ARBA VEHICULO",
                                        data: {
                                            item: vehiculo,
                                            propietario: copropietario,
                                            message: "No se pudo procesar el propietario"
                                        }
                                    };

                                    await this.publishService.sendMessage(`${this.IMPORT_ARBA_RABBIT_QUEUE}/parsePropietarios`, "AddAlerta", userId.toString(), data);
                                    continue;
                                }
                            }

                            const denunciasPorVehiculo = denuncias.filter(f => f.dominio === vehiculo.dominio);
                            for (const denuncia of denunciasPorVehiculo) {
                                const detalleDenuncia = `Denuncia (Nro. Municipio: ${denuncia.nroMunicipio}): Dominio: ${denuncia.dominio} - Nombre y Apellido: ${denuncia.nombreYApellido} - Dirección: ${denuncia.calle} ${denuncia.numero} CP: ${denuncia.codigoPostalLargo}, ${denuncia.localidad}`
                                vehiculoDTO.observaciones.push(new ObservacionState(0, entidad, idVehiculo, detalleDenuncia, idUsuario, getDateNow(true), 'a'));
                            }

                            const deudasPorVehiculo = deudas.filter(f => f.dominio === vehiculo.dominio);
                            for (let j = 0; j < deudasPorVehiculo.length; j++) {
                                const deuda = deudasPorVehiculo[j];
                                const deudaPeriodos = deuda.deudasPeriodoArba;
                                const deudaMoratorias = deuda.deudasMoratoriaArba;

                                for (let k = 0; k < deudaPeriodos.length; k++) {
                                    const deudaPeriodo = deudaPeriodos[k];
                                    const montoActual = deudaPeriodo.montoActual / 100;
                                    const montoOriginal = deudaPeriodo.montoOriginal / 100;

                                    vehiculoDTO.deudasPeriodoArba.push(new DeudaPeriodoArba(0, deudaPeriodo.periodo, montoOriginal, montoActual));
                                }

                                for (let l = 0; l < deudaMoratorias.length; l++) {
                                    const deudaMoratoria = deudaMoratorias[l];
                                    const monto = deudaMoratoria.monto / 100;

                                    vehiculoDTO.deudasMoratoriaArba.push(new DeudaMoratoriaArba(0, deudaMoratoria.moratoria, monto));
                                }
                            }

                            // se agrega etiqueta
                            vehiculoDTO.etiquetas.push(new EtiquetaState(0, entidad, idVehiculo, codigoEntidad, 'a'));
                            // se agrega observacion
                            vehiculoDTO.observaciones.push(new ObservacionState(0, entidad, idVehiculo, detalleObservacion, idUsuario, getDateNow(true), 'a'));

                            await this.vehiculoService.addImportacion(token, vehiculoDTO) as VehiculoDTO;
                        }
                    }
                    catch (error) {
                        const data = {
                            token: token,
                            idTipoAlerta: 30,
                            idUsuario: idUsuario,
                            fecha: getDateNow(true),
                            idModulo: 30,
                            origen: `${this.IMPORT_ARBA_RABBIT_QUEUE}/parsePropietarios`,
                            mensaje: "Error Importación ARBA VEHICULO",
                            data: {
                                item: vehiculos[i],
                                error: castPublicError(error),
                                message: "Error al procesar el alta"
                            }
                        };
                        await this.publishService.sendMessage(`${this.IMPORT_ARBA_RABBIT_QUEUE}/parseVehiculos`, "AddAlerta", userId.toString(), data);
                    }
                }
                resolve({});
            }
            catch (error) {
                reject(new ProcessError('Error procesando importacion', error));
            }
        });
    }

    async executeAddPersona(token: string, data: any) {
        if (data.idTipoPersona === TIPO_PERSONA.FISICA) {
            const personaFisicaDTO = new PersonaFisicaDTO();

            personaFisicaDTO.persona.idTipoDocumento = data.idTipoDocumento;
            personaFisicaDTO.persona.numeroDocumento = data.numeroDocumento;
            personaFisicaDTO.persona.nombre = data.nombrePersona;
            personaFisicaDTO.persona.origen = "ARBA_VEHICULO";

            personaFisicaDTO.direccion.entidad = "PersonaFisica";
            personaFisicaDTO.direccion.codigoPostal = data.codigoPostal;
            personaFisicaDTO.direccion.calle = data.calle;
            personaFisicaDTO.direccion.altura = data.numero;
            personaFisicaDTO.direccion.piso = data.piso;
            personaFisicaDTO.direccion.dpto = data.departamento;
            personaFisicaDTO.direccion.idProvincia = data.idProvincia;
            personaFisicaDTO.direccion.idPais = data.idPais;
            personaFisicaDTO.direccion.origen = "ARBA_VEHICULO";

            personaFisicaDTO.documentos.push(new DocumentoState(-1, data.idTipoPersona, -1, data.idTipoDocumento, data.numeroDocumento, true, 'a'));

            const dto = await this.personaService.addPersonaFisica(token, personaFisicaDTO) as PersonaFisicaDTO;
            if (dto)
                return new Persona(dto.persona.id, data.idTipoPersona, data.nombrePersona, data.idTipoDocumento, data.numeroDocumento);
            else
                return null;
        }
        else if (data.idTipoPersona === TIPO_PERSONA.JURIDICA) {
            const personaJuridicaDTO = new PersonaJuridicaDTO();

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

            personaJuridicaDTO.domicilioFiscal.entidad = "PersonaJuridicaDomicilioFiscal";
            personaJuridicaDTO.domicilioFiscal.codigoPostal = data.codigoPostal;
            personaJuridicaDTO.domicilioFiscal.calle = data.calle;
            personaJuridicaDTO.domicilioFiscal.altura = data.numero;
            personaJuridicaDTO.domicilioFiscal.piso = data.piso;
            personaJuridicaDTO.domicilioFiscal.dpto = data.departamento;
            personaJuridicaDTO.domicilioFiscal.idProvincia = data.idProvincia;
            personaJuridicaDTO.domicilioFiscal.idPais = data.idPais;

            personaJuridicaDTO.documentos.push(new DocumentoState(-1, data.idTipoPersona, -1, data.idTipoDocumento, data.numeroDocumento, true, 'a'));

            const dto = await this.personaService.addPersonaJuridica(token, personaJuridicaDTO) as PersonaJuridicaDTO;
            if (dto)
                return new Persona(dto.persona.id, data.idTipoPersona, data.nombrePersona, data.idTipoDocumento, data.numeroDocumento);
            else
                return null;
        }
    }

    private getIdTipoDocumento(tipoDocumento: string) {
        let idTipoDocumentoTitular: number = 0;
        switch (tipoDocumento) {
            case "0":
                idTipoDocumentoTitular = 0;
                break;
            case "1":
                idTipoDocumentoTitular = 510;
                break;
            case "9":
                idTipoDocumentoTitular = 512;
                break;
            case "6":
                idTipoDocumentoTitular = 513;
                break;
            default:
                idTipoDocumentoTitular = null;
                break;
        }

        return idTipoDocumentoTitular;
    }

    private async parsePropietariosFile(propietariosPath: string): Promise<PropietarioDTO[]> {
        const propietarios: PropietarioDTO[] = await this.parseFileRows(propietariosPath, () => new PropietarioDTO());
        propietarios.forEach(propietario => {
            const coPropietarios = this.splitCoPropietarios(propietario.propietarios);
            delete propietario.propietarios;
            coPropietarios.forEach(coPropietario => {
                if (!this.isOnlyZeros(coPropietario)) {
                    const coPropietarioDTO = new CoPropietarioDTO();
                    coPropietarioDTO.convertFixedWidth(coPropietario);
                    propietario.coPropietarios.push(coPropietarioDTO);
                }
            });
        });
        return propietarios;
    }

    private splitCoPropietarios(propietarios: string) {
        const coPropietarioLength = 134;
        const result = [];
        for (let i = 0; i < propietarios.length; i += coPropietarioLength) {
            result.push(propietarios.substring(i, i + coPropietarioLength));
        }
        return result;
    }

    private async parseDeudasFile(deudasPath: string): Promise<DeudaDTO[]> {
        const deudas = await this.parseFileRows(deudasPath, () => new DeudaDTO());
        deudas.forEach(deuda => {
            const periodos = this.splitDeudaPeriodos(deuda.periodos);
            const moratorias = this.splitDeudaMoratorias(deuda.moratorias);
            delete deuda.periodos;
            delete deuda.moratorias;
            periodos.forEach(periodo => {
                if (!this.isOnlyZeros(periodo)) {
                    const deudaPeriodoDTO = new DeudaPeriodoArba();
                    deudaPeriodoDTO.convertFixedWidth(periodo);
                    deuda.deudasPeriodoArba.push(deudaPeriodoDTO);
                }
            });
            moratorias.forEach(moratoria => {
                if (!this.isOnlyZeros(moratoria)) {
                    const deudaMoratoriaDTO = new DeudaMoratoriaArba();
                    deudaMoratoriaDTO.convertFixedWidth(moratoria);
                    deuda.deudasMoratoriaArba.push(deudaMoratoriaDTO);
                }
            });
        });
        return deudas;
    }

    private splitDeudaPeriodos(periodos: string) {
        const periodoLength = 26;
        const result = [];
        for (let i = 0; i < periodos.length; i += periodoLength) {
            result.push(periodos.substring(i, i + periodoLength));
        }
        return result;
    }

    private splitDeudaMoratorias(moratorias: string) {
        const moratoriaLength = 14;
        const result = [];
        for (let i = 0; i < moratorias.length; i += moratoriaLength) {
            result.push(moratorias.substring(i, i + moratoriaLength));
        }
        return result;
    }

    private async parseFileRows(filePath: string, createDTO: () => any) {
        const pathFileSource = `${config.PATH.TEMP}${filePath}`;
        const content = fs.readFileSync(pathFileSource, { encoding: 'utf8', flag: 'r' });
        const rows = content.split('\n').filter(l => l);

        return rows.map(line => {
            const dto = createDTO();
            dto.convertFixedWidth(line);
            return dto;
        });
    }

    private isOnlyZeros(str) {
        return /^0+$/.test(str.replaceAll(" ", ""));
    }

    private extractTokenAndUserId() {
        let userId = 0;
        const localStorage = getNamespace('LocalStorage');
        const token = localStorage.get("accessToken");

        try {
            const dataToken = verifyAccessToken(token);
            if (dataToken) {
                userId = dataToken.idUsuario;
            }
        } catch {
            throw new ReferenceError('Token incorrecto');
        }
        return { userId, token };
    }
}