import Cuenta from '../entities/cuenta';
import Inmueble from '../entities/inmueble';
import ICuentaRepository from '../repositories/cuenta-repository';
import InmuebleRepository from '../repositories/inmueble-repository';
import IVinculoInmuebleRepository from '../repositories/vinculo-inmueble-repository';
import ILadoTerrenoRepository from '../repositories/lado-terreno-repository';
import IValuacionRepository from '../repositories/valuacion-repository';
import IZonaEntregaRepository from '../repositories/zona-entrega-repository';
import ITipoControladorRepository from '../repositories/tipo-controlador-repository';
import DireccionService from './direccion-service';
import VariableCuentaService from './variable-cuenta-service';
import ContribuyenteService from './contribuyente-service';
import ControladorCuentaService from './controlador-cuenta-service';
import ControladorService from './controlador-service';
import ConfiguracionService from './configuracion-service';

import { isValidString, isValidInteger, isValidArray, isNull } from '../../infraestructure/sdk/utils/validator';
import { getCatastral, getDateNow, getDireccion } from '../../infraestructure/sdk/utils/convert';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import CuentaFilter from '../dto/cuenta-filter';
import CuentaRow from '../dto/cuenta-row';
import { distinctArray } from '../../infraestructure/sdk/utils/helper';
import Contribuyente from '../entities/contribuyente';
import PersonaMin from '../dto/persona-min';
import CuentaData from '../dto/cuenta-data';
import LadoTerrenoState from '../dto/lado-terreno-state';
import ZonaEntregaState from '../dto/zona-entrega-state';
import TipoControlador from '../entities/tipo-controlador';
import Direccion from '../entities/direccion';
import VinculoInmuebleState from '../dto/vinculo-inmueble-state';
import CuentaOrdenamiento from '../dto/cuenta-ordenamiento';
import CuentaCalculo from '../dto/cuenta-calculo';
import CuentaRecibo from '../dto/cuenta-recibo';
import VariableCuenta from '../entities/variable-cuenta';
import ControladorCuenta from '../entities/controlador-cuenta';
import Configuracion from '../entities/configuracion';
import Valuacion from '../entities/valuacion';
import ComercioDTO from '../dto/comercio-dto';
import Comercio from '../entities/comercio';
import IComercioRepository from '../repositories/comercio-repository';
import VehiculoDTO from '../dto/vehiculo-dto';
import Vehiculo from '../entities/vehiculo';
import IVehiculoRepository from '../repositories/vehiculo-repository';
import CementerioDTO from '../dto/cementerio-dto';
import Cementerio from '../entities/cementerio';
import ICementerioRepository from '../repositories/cementerio-repository';
import ICuentaCorrienteItemRepository from '../repositories/cuenta-corriente-item-repository';
import { TRIBUTO_TYPE } from '../../infraestructure/sdk/consts/tributoType';
import CuentaCorrienteItem from '../entities/cuenta-corriente-item';


export default class CuentaService {

    cuentaRepository: ICuentaRepository;
    inmuebleRepository: InmuebleRepository;
    vinculoInmuebleRepository: IVinculoInmuebleRepository;
    ladoTerrenoRepository: ILadoTerrenoRepository;
    valuacionRepository: IValuacionRepository;
    zonaEntregaRepository: IZonaEntregaRepository;
    tipoControladorRepository: ITipoControladorRepository;
    direccionService: DireccionService;
    variableCuentaService: VariableCuentaService;
    contribuyenteService: ContribuyenteService;
    controladorCuentaService: ControladorCuentaService;
    controladorService: ControladorService;
	configuracionService: ConfiguracionService;
    comercioRepository: IComercioRepository;
    vehiculoRepository: IVehiculoRepository;
    cementerioRepository: ICementerioRepository;
    cuentaCorrienteItemRepository: ICuentaCorrienteItemRepository;

    constructor(cuentaRepository: ICuentaRepository, 
                inmuebleRepository: InmuebleRepository,
                vinculoInmuebleRepository: IVinculoInmuebleRepository,
                ladoTerrenoRepository: ILadoTerrenoRepository,
                valuacionRepository: IValuacionRepository,
                zonaEntregaRepository: IZonaEntregaRepository,
                tipoControladorRepository: ITipoControladorRepository,
                direccionService: DireccionService,
                variableCuentaService: VariableCuentaService,
                contribuyenteService: ContribuyenteService,
                controladorCuentaService: ControladorCuentaService,
                controladorService: ControladorService,
                configuracionService: ConfiguracionService,
                comercioRepository: IComercioRepository,
                vehiculoRepository: IVehiculoRepository,
                cementerioRepository: ICementerioRepository,
                cuentaCorrienteItemRepository: ICuentaCorrienteItemRepository) {
        this.cuentaRepository = cuentaRepository;
        this.inmuebleRepository = inmuebleRepository;
        this.vinculoInmuebleRepository = vinculoInmuebleRepository;
        this.ladoTerrenoRepository = ladoTerrenoRepository;
        this.zonaEntregaRepository = zonaEntregaRepository;
        this.valuacionRepository = valuacionRepository;
        this.tipoControladorRepository = tipoControladorRepository;
        this.direccionService = direccionService;
        this.variableCuentaService = variableCuentaService;
        this.contribuyenteService = contribuyenteService;
        this.controladorCuentaService = controladorCuentaService;
        this.controladorService = controladorService;
        this.configuracionService = configuracionService;
        this.comercioRepository = comercioRepository;
        this.vehiculoRepository = vehiculoRepository;
        this.cementerioRepository = cementerioRepository;
        this.cuentaCorrienteItemRepository = cuentaCorrienteItemRepository;
    }

    async list() {
        return new Promise( async (resolve, reject) => {
            try {
                const result = await this.cuentaRepository.list();
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async listByFilter(cuentaFilter:CuentaFilter) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = (await this.cuentaRepository.listByFilter(cuentaFilter) as Array<CuentaRow>).sort((a, b) => a.numeroCuenta.localeCompare(b.numeroCuenta));
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async listByContribuyente(idContribuyente:number) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = await this.cuentaRepository.listByContribuyente(idContribuyente) as Array<Cuenta>;
                let cuentas: Array<CuentaRow> = [];
                let cuentaData = new CuentaData();
                cuentaData.setFromObject(result);
                
                for (let i = 0; i < result.length; i++) {
                    let cuenta = new CuentaRow();
                    cuenta.id = result[i].id;
                    cuenta.idContribuyente = idContribuyente;
                    cuenta.numeroCuenta = result[i].numeroCuenta;
                    cuenta.numeroWeb = result[i].numeroWeb;
                    cuenta.idTipoTributo = result[i].idTipoTributo;
                    cuenta.idTributo = result[i].idTributo;
                    switch (cuenta.idTipoTributo) {
                        case 10: // Inmueble
                            const lados = await this.ladoTerrenoRepository.listByInmueble(result[i].idTributo) as Array<LadoTerrenoState>;
                            
                            const ladosFrente = lados.filter(f => f.idTipoLado === 40).sort((a, b) => b.id - a.id);
                            if (ladosFrente.length > 0) {
                                const ladoFrente = ladosFrente[0]; // Se selecciona el primer frente.
                                cuenta.detalleTributo = 'Dirección: ' + getDireccion(ladoFrente.direccion);
                            }
                            break;
                        case 11: // Comercio
                            let comercioDTO = new ComercioDTO();
                            comercioDTO.comercio = await this.comercioRepository.findById(result[i].idTributo) as Comercio;
                            cuenta.detalleTributo = 'Nombre fantasía: ' + comercioDTO.comercio.nombreFantasia;
                            break;
                        case 12: // Vehículo
                            let vehiculoDTO = new VehiculoDTO();
                            vehiculoDTO.vehiculo = await this.vehiculoRepository.findById(result[i].idTributo) as Vehiculo;
                            cuenta.detalleTributo = 'Dominio: ' + vehiculoDTO.vehiculo.dominio;
                            break;
                        case 13: // Cementerio
                            let cementerioDTO = new CementerioDTO();
                            cementerioDTO.cementerio = await this.cementerioRepository.findById(result[i].idTributo) as Cementerio;
                            cuenta.detalleTributo = 'Dirección: ' + cementerioDTO.cementerio.frenteCementerio;
                            break;
                        case 14: // Fondeadero
                            cuenta.detalleTributo = 'Número de cuenta: ' + result[i].numeroCuenta;
                            break;
                        case 15: // Cuenta especial
                            cuenta.detalleTributo = 'Número de cuenta: ' + result[i].numeroCuenta;
                            break;
                        default:
                            break;
                    }
                    cuentas.push(cuenta);
                }
                
                resolve(cuentas);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async listByPersona(idPersona: number) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = await this.cuentaRepository.listByPersona(idPersona);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async listByTipoTributo(idTipoTributo: number) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = (await this.cuentaRepository.listByTipoTributo(idTipoTributo)).sort((a, b) => a.numeroCuenta.localeCompare(b.numeroCuenta));
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async listByCalculo(idEmisionEjecucion: number) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = (await this.cuentaRepository.listByCalculo(idEmisionEjecucion) as Array<CuentaCalculo>);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async listByOrdenamiento(idEmisionEjecucion: number) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = (await this.cuentaRepository.listByOrdenamiento(idEmisionEjecucion) as Array<CuentaOrdenamiento>);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async findById(id: number) {
        return new Promise( async (resolve, reject) => {
            try {               
                const result = await this.cuentaRepository.findById(id);
                if (!result) {
                    reject(new ReferenceError('No existe el registro'));
                    return;
                }
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async findDataById(id: number) {
        return new Promise( async (resolve, reject) => {
            try {               
                const cuenta = await this.cuentaRepository.findById(id) as Cuenta;
                if (!cuenta) {
                    reject(new ReferenceError('No existe el registro'));
                    return;
                }

                let cuentaData = new CuentaData();
                cuentaData.setFromObject(cuenta);

                if (cuenta.idTipoTributo === 10) { //Inmueble
                    const inmueble = await this.inmuebleRepository.findById(cuenta.idTributo) as Inmueble;
                    const vinculos = await this.vinculoInmuebleRepository.listByInmueble(cuenta.idTributo) as Array<VinculoInmuebleState>;
                    
                    const titulares = vinculos.filter(f => f.idTipoVinculoInmueble === 51).sort((a, b) => b.id - a.id);
                    if (titulares.length > 0) {
                        const titular = titulares[0]; //elijo al primer titular
                        cuentaData.vendedor = titular.nombrePersona;
                    }
                    if (cuenta.idDireccionPrincipal) {
                        const direccion = await this.direccionService.findById(cuenta.idDireccionPrincipal) as Direccion;
                        cuentaData.direccion = getDireccion(direccion);
                    }
                    cuentaData.partida = getCatastral(inmueble);
                }

                resolve(cuentaData);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async findReciboById(id: number) {
        return new Promise( async (resolve, reject) => {
            try {               
                const cuenta = await this.cuentaRepository.findById(id);
                if (!cuenta) {
                    reject(new ReferenceError('No existe el registro'));
                    return;
                }
                const nomenclaturaCatastral:string = (await this.configuracionService.findByNombre("NomenclaturaCatastral") as Configuracion).valor;

                let cuentaRecibo = new CuentaRecibo();
                cuentaRecibo.cuenta = cuenta;

                let requests = [];
                if (cuenta.idTipoTributo === 10) requests.push(this.inmuebleRepository.findById(cuenta.idTributo));
                if (cuenta.idContribuyentePrincipal) requests.push(this.contribuyenteService.findById(cuenta.idContribuyentePrincipal));
                if (cuenta.idDireccionPrincipal) requests.push(this.direccionService.findById(cuenta.idDireccionPrincipal));
                if (cuenta.idDireccionEntrega) requests.push(this.direccionService.findById(cuenta.idDireccionEntrega));
                if (cuenta.idTipoTributo === 10) requests.push(this.valuacionRepository.listByInmueble(cuenta.idTributo));
                requests.push(this.variableCuentaService.listByCuenta(cuenta.id));
                requests.push(this.controladorCuentaService.listByCuenta(cuenta.id));

                Promise.all(requests)
                .then(async responses => {
                    const toDay = getDateNow(false);
                    let indexResponse = 0;

                    if (cuenta.idTipoTributo === 10) {
                        const inmueble = responses[indexResponse++] as Inmueble;
                        cuentaRecibo.partida = getCatastral(inmueble, true, nomenclaturaCatastral);
                        cuentaRecibo.nomenclatura = getCatastral(inmueble, false, nomenclaturaCatastral);
                    }
                    if (cuenta.idContribuyentePrincipal) {
                        cuentaRecibo.contribuyentePrincipal = responses[indexResponse++] as Contribuyente;
                    }
                    if (cuenta.idDireccionPrincipal) {
                        cuentaRecibo.direccionPrincipal = responses[indexResponse++] as Direccion;
                    }
                    if (cuenta.idDireccionEntrega) {
                        cuentaRecibo.direccionEntrega = responses[indexResponse++] as Direccion;
                    }
                    if (cuenta.idTipoTributo === 10) {
                        cuentaRecibo.valuaciones = responses[indexResponse++] as Array<Valuacion>;
                    }

                    //si no hay direccion ppal pero si contribuyente ppal, busco su domicilio actual en administracion
                    if (cuenta.idDireccionPrincipal <= 0 && cuenta.idContribuyentePrincipal > 0) {
                        const entidadPersona = (cuentaRecibo.contribuyentePrincipal.idTipoPersona === 500) ? "PersonaFisica" : "PersonaJuridicaDomicilioLegal";
                        try {
                            const direcciones = (await this.direccionService.listByEntidadAdministracion(entidadPersona, cuentaRecibo.contribuyentePrincipal.idPersona)) as Array<Direccion>;
                            if (direcciones.length === 0) {
                                reject(new ValidationError('El contribuyente no tiene domicilios asociados'));
                                return;
                            }
                            cuentaRecibo.direccionPrincipal = direcciones[0];
                        }
                        catch(error) {
                            reject(new ValidationError('No se pudo obtener el domicilio del contribuyente'));
                            return;
                        }
                    }
                    
                    cuentaRecibo.variablesCuenta = responses[indexResponse++] as Array<VariableCuenta>;
                    cuentaRecibo.controladoresCuenta = responses[indexResponse++] as Array<ControladorCuenta>;
                    const controladoresCuentaPostal = cuentaRecibo.controladoresCuenta
                        .filter(f => f.tipoControlador.direccion && 
                                    (isNull(f.fechaDesde) || f.fechaDesde <= toDay) &&
                                    (isNull(f.fechaHasta) || f.fechaHasta >= toDay))
                        .sort((a,b) => a.id-b.id);
                    cuentaRecibo.controlador = (controladoresCuentaPostal.length > 0) ? controladoresCuentaPostal[0].controlador : null;

                    resolve(cuentaRecibo);
                })
                .catch((error) => {
                    reject(error);
                });
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async add(cuenta: Cuenta) {
        return new Promise( async (resolve, reject) => {
            try {
                if (!isValidString(cuenta.numeroWeb, false) ||
                    !isValidInteger(cuenta.idTipoTributo, true) ||
                    !isValidInteger(cuenta.idTributo, true) ||
                    !isValidInteger(cuenta.idEstadoCuenta, true)
                ) {
                    reject(new ValidationError('Existen campos incompletos'));
                    return;
                }

                if (await this.cuentaRepository.findByNumeroCuenta(cuenta.numeroCuenta) !== null) {
                    reject(new ValidationError('Ya existe el número de cuenta'));
                    return;
                }

                cuenta.fechaAlta = getDateNow();
                cuenta.fechaBaja = null;
                cuenta = await this.cuentaRepository.add(cuenta);
                //el numero de cuenta es un autonumerico (reutilizamos el id)
                cuenta.numeroCuenta = cuenta.id.toString();
                const result = await this.cuentaRepository.modify(cuenta.id, cuenta);

                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async modify(id: number, cuenta: Cuenta) {
        return new Promise( async (resolve, reject) => {
            try {
                const cuentaOriginal = await this.findById(id) as Cuenta;
                if (cuentaOriginal.idEstadoCuenta === 3) {
                    reject(new ValidationError('No se puede modificar una cuenta inactiva'));
                    return;
                }

                if (!isValidString(cuenta.numeroWeb, false) ||
                    !isValidInteger(cuenta.idEstadoCuenta, true)
                ) {
                    reject(new ValidationError('Existen campos incompletos'));
                    return;
                }

                const existing = await this.cuentaRepository.findByNumeroCuenta(cuenta.numeroCuenta) as (Cuenta | null)
                if (existing !== null && existing.id !== id) {
                    reject(new ValidationError('Ya existe el número de cuenta'));
                    return;
                }

                cuenta.fechaBaja = (cuenta.idEstadoCuenta == 3) ? getDateNow() : null; //3:Inactiva
                if (cuenta.idContribuyentePrincipal === 0) cuenta.idContribuyentePrincipal = null;
                if (cuenta.idDireccionPrincipal === 0) cuenta.idDireccionPrincipal = null;
                if (cuenta.idDireccionEntrega === 0) cuenta.idDireccionEntrega = null;
                const result = await this.cuentaRepository.modify(id, cuenta);
                if (!result) {
                    reject(new ReferenceError('No existe el registro'));
                    return;
                }
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async modifyBajaById(id: number) {
        return new Promise( async (resolve, reject) => {
            try {               
                const cuenta = await this.cuentaRepository.findById(id) as Cuenta;
                if (!cuenta) {
                    reject(new ReferenceError('No existe el registro'));
                    return;
                }

                const items = await this.cuentaCorrienteItemRepository.listByCuenta(id) as Array<CuentaCorrienteItem>;
                let importeSaldo = 0;
                for (let index = 0; index < items.length; index++) {
                    const item = items[index];
                    importeSaldo += (item.importeDebe-item.importeHaber);
                    //si es el ultimo o distinto al siguiente lo guardo
                    if (index === items.length - 1 || item.numeroPartida !== items[index+1].numeroPartida)
                    {
                        if (importeSaldo > 0) {
                            reject(new ReferenceError('No se puede dar de baja una cuenta con deuda'));
                            return; 
                        }
                        importeSaldo = 0;
                    }
                }

                if (cuenta.idTipoTributo === TRIBUTO_TYPE.VEHICULOS) {
                    const vehiculo = await this.vehiculoRepository.findById(cuenta.idTributo) as Vehiculo;
                    if (vehiculo.idMotivoBajaVehiculo <= 0 || isNull(vehiculo.fechaBaja)) {
                        reject(new ReferenceError('Debe cargar el motivo y fecha de baja primero'));
                        return; 
                    }
                }

                cuenta.idEstadoCuenta = 3; //Inactiva (baja)

                const result = await this.modify(id, cuenta);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async remove(id: number) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = await this.cuentaRepository.remove(id);
                if (!result) {
                    reject(new ReferenceError('No existe el registro'));
                    return;
                }
                resolve(result);
            }
            catch(error) {
                if (error.name == "SequelizeForeignKeyConstraintError") {
                    reject(new ReferenceError('No se pudo borrar el registro porque existen datos relacionados'));
                }
                else {
                    reject(new ProcessError('Error procesando datos', error));
                }
            }
        });
    }


    async checkContribuyente(id:number, idContribuyente:number) {
        return new Promise( async (resolve, reject) => {
            try {
                if (!isValidInteger(idContribuyente, true)) {
                    reject(new ValidationError('Existen campos incompletos'));
                    return;
                }

                const result = await this.cuentaRepository.checkContribuyente(id, idContribuyente);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async bindContribuyentes(id:number, contribuyentes:number[]) {
        return new Promise( async (resolve, reject) => {
            try {
                if (!isValidArray(contribuyentes, true)) {
                    reject(new ValidationError('Existen campos incompletos'));
                    return;
                }

                const result = await this.cuentaRepository.bindContribuyentes(id, contribuyentes);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async unbindContribuyentes(id:number, contribuyentes:number[]) {
        return new Promise( async (resolve, reject) => {
            try {
                if (!isValidArray(contribuyentes, true)) {
                    reject(new ValidationError('Existen campos incompletos'));
                    return;
                }

                const result = await this.cuentaRepository.unbindContribuyentes(id, contribuyentes);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async unbindAllContribuyentes(id:number) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = await this.cuentaRepository.unbindAllContribuyentes(id);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }


    async updateContribuyentes(id:number, personasVinculo: Array<PersonaMin>, personasContribuyenteIds: Array<number>) {
        return new Promise( async (resolve, reject) => {
            try {
                let contribuyenteIds = [];
                const personasVinculoIDs = distinctArray(personasVinculo.map(x => x.idPersona));
                const personasNoContribuyenteIDs = personasVinculoIDs.filter(id => !personasContribuyenteIds.includes(id));
                //quito la relacion a todos los no contribuyentes
                if (personasNoContribuyenteIDs.length > 0) {
                    const contribuyentes = [];
                    for(let i=0; i < personasNoContribuyenteIDs.length; i++) {
                        const idPersona = personasNoContribuyenteIDs[i];
                        try {
                            let contribuyente = null;
                            //busco el contribuyente por persona
                            contribuyente = await this.contribuyenteService.findByPersona(idPersona) as Contribuyente;
                            contribuyentes.push(contribuyente.id);
                        }
                        catch(error) {
                            //si no encuentro el contribuyente no hago nada (ya no habria que quitarlo)
                            if (!(error instanceof ReferenceError)) {
                                reject(error);
                            }
                        }
                    }
                    if (contribuyentes.length > 0) {
                        await this.unbindContribuyentes(id, contribuyentes);
                    }
                }
                //agrego la relacion a cada contribuyente (primero tengo que verificar que exista el contribuyente)
                for(let i=0; i < personasContribuyenteIds.length; i++) {
                    const idPersona = personasContribuyenteIds[i];
                    try {
                        let contribuyente = null;
                        try {
                            //busco el contribuyente por persona
                            contribuyente = await this.contribuyenteService.findByPersona(idPersona) as Contribuyente;
                            contribuyenteIds.push(contribuyente.id);
                        }
                        catch(error) {
                            if (error instanceof ReferenceError) {
                                //como no existe, doy de alta el contribuyente con datos de la persona de un vinculo
                                const persona = personasVinculo.filter(f => f.idPersona === idPersona)[0];
                                contribuyente = new Contribuyente();
                                contribuyente.setFromObject({...persona, id: 0, fechaAlta: getDateNow()});
                                contribuyente = await this.contribuyenteService.add(contribuyente as Contribuyente) as Contribuyente;
                                contribuyenteIds.push(contribuyente.id);
                            }
                            else {
                                reject(error);
                            }
                        }
                        //vinculo el contribuyente con la cuenta (si no existe la relacion)
                        const check = await this.checkContribuyente(id, contribuyente.id);
                        if (!check) {
                            await this.bindContribuyentes(id, [contribuyente.id]);
                        }
                    }
                    catch(error) {
                        if (error instanceof ValidationError ||
                            error instanceof ProcessError ||
                            error instanceof ReferenceError) {
                            reject(error);
                        }
                        else {
                            reject(new ProcessError('Error procesando datos', error));
                        }
                    }
                }
                //guardo el contribuyente principal
                const cuenta = await this.cuentaRepository.findById(id) as Cuenta;
                cuenta.idContribuyentePrincipal = (contribuyenteIds.length > 0) ? contribuyenteIds[0] : null; //es el primero
                await this.cuentaRepository.modify(id, cuenta);

                const result = { id: id };
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async updateDireccionPrincipal(id:number) {
        return new Promise( async (resolve, reject) => {
            try {

                let done = false;
                const cuenta = await this.cuentaRepository.findById(id) as Cuenta;
                if (cuenta.idTipoTributo === 10) {//Inmueble
                    const lados = await this.ladoTerrenoRepository.listByInmueble(cuenta.idTributo) as Array<LadoTerrenoState>;
                    const ladosFrente = lados.filter(f => f.idTipoLado === 40) as Array<LadoTerrenoState>;
                    if (ladosFrente.length > 0) {
                        const ladoFrente = ladosFrente.sort((a,b) => a.id - b.id)[0];
                        cuenta.idDireccionPrincipal = ladoFrente.direccion.id;
                        await this.cuentaRepository.modify(id, cuenta);
                        done = true;
                    }
                }

                if (!done) {
                    if (cuenta.idDireccionPrincipal) {
                        cuenta.idDireccionPrincipal = null;
                        await this.cuentaRepository.modify(id, cuenta);
                    }
                }

                const result = { id: id };
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async updateDireccionEntrega(id:number) {
        return new Promise( async (resolve, reject) => {
            try {
                const cuenta = await this.cuentaRepository.findById(id) as Cuenta;
                const idTiposControladoresPostal = (await this.tipoControladorRepository.list() as Array<TipoControlador>).filter(f => f.direccion).map(x => x.id);
                const zonasEntregas = await this.zonaEntregaRepository.listByCuenta(id) as Array<ZonaEntregaState>;
                const zonasEntregasPostal = zonasEntregas.filter(f => idTiposControladoresPostal.includes(f.idTipoControlador)) as Array<ZonaEntregaState>;
                if (zonasEntregasPostal.length > 0) {
                    const zonaEntregaPostal = zonasEntregasPostal.sort((a,b) => a.id - b.id)[0];
                    cuenta.idDireccionEntrega = zonaEntregaPostal.direccion.id;
                    await this.cuentaRepository.modify(id, cuenta);
                }
                else {
                    if (cuenta.idDireccionEntrega) {
                        cuenta.idDireccionEntrega = null;
                        await this.cuentaRepository.modify(id, cuenta);
                    }
                }

                const result = { id: id };
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }
    
}
