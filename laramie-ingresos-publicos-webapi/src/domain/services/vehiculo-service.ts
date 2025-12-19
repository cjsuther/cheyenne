import Vehiculo from '../entities/vehiculo';
import Cuenta from '../entities/cuenta';
import RelacionCuenta from '../entities/relacion-cuenta';
import Direccion from '../entities/direccion';
import VariableCuenta from '../entities/variable-cuenta';
import VinculoVehiculo from '../entities/vinculo-vehiculo';
import ZonaEntrega from '../entities/zona-entrega';
import ControladorCuenta from '../entities/controlador-cuenta';
import CondicionEspecial from '../entities/condicion-especial';
import RecargoDescuento from '../entities/recargo-descuento';
import DebitoAutomatico from '../entities/debito-automatico';

import VehiculoRow from '../dto/vehiculo-row';
import VehiculoFilter from '../dto/vehiculo-filter';
import VehiculoDTO from '../dto/vehiculo-dto';
import RelacionCuentaState from '../dto/relacion-cuenta-state';
import InformacionAdicionalDTO from '../dto/informacion-adicional-dto';
import RelacionCuentaService from './relacion-cuenta-service';
import ArchivoState from '../dto/archivo-state';
import ObservacionState from '../dto/observacion-state';
import EtiquetaState from '../dto/etiqueta-state';
import VariableCuentaState from '../dto/variable-cuenta-state';
import VinculoVehiculoState from '../dto/vinculo-vehiculo-state';
import ZonaEntregaState from '../dto/zona-entrega-state';
import ControladorCuentaState from '../dto/controlador-cuenta-state';
import CondicionEspecialState from '../dto/condicion-especial-state';
import RecargoDescuentoState from '../dto/recargo-descuento-state';
import DebitoAutomaticoState from '../dto/debito-automatico-state';

import IVehiculoRepository from '../repositories/vehiculo-repository';
import ContribuyenteService from './contribuyente-service';
import CuentaService from './cuenta-service';
import DireccionService from './direccion-service';
import InformacionAdicionalService from './informacion-adicional-service';
import ArchivoService from './archivo-service';
import ObservacionService from './observacion-service';
import EtiquetaService from './etiqueta-service';
import VariableService from './variable-service';
import VariableCuentaService from './variable-cuenta-service';
import VinculoVehiculoService from './vinculo-vehiculo-service';
import ZonaEntregaService from './zona-entrega-service';
import ControladorCuentaService from './controlador-cuenta-service';
import CondicionEspecialService from './condicion-especial-service';
import RecargoDescuentoService from './recargo-descuento-service';
import DebitoAutomaticoService from './debito-automatico-service';
import IncisoVehiculoService from './inciso-vehiculo-service';

import { isValidString, isValidInteger, isValidDate, isValidFloat } from '../../infraestructure/sdk/utils/validator';
import { getDateNow } from '../../infraestructure/sdk/utils/convert';
import { distinctArray } from '../../infraestructure/sdk/utils/helper';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import PersonaMin from '../dto/persona-min';
import IncisoVehiculo from '../entities/inciso-vehiculo';


export default class VehiculoService {

    vehiculoRepository: IVehiculoRepository;
    contribuyenteService: ContribuyenteService;
    cuentaService: CuentaService;
    relacionCuentaService: RelacionCuentaService;
    direccionService: DireccionService;
    informacionAdicionalService: InformacionAdicionalService;
    archivoService: ArchivoService;
    observacionService: ObservacionService;
    etiquetaService: EtiquetaService;
    variableService: VariableService;
    variableCuentaService: VariableCuentaService;
    vinculoVehiculoService: VinculoVehiculoService;
    zonaEntregaService: ZonaEntregaService;
    controladorCuentaService: ControladorCuentaService;
    condicionEspecialService: CondicionEspecialService;
    recargoDescuentoService: RecargoDescuentoService;
    debitoAutomaticoService: DebitoAutomaticoService;
    incisoVehiculoService: IncisoVehiculoService;

    constructor(vehiculoRepository: IVehiculoRepository, contribuyenteService: ContribuyenteService, cuentaService: CuentaService, relacionCuentaService: RelacionCuentaService,
                direccionService: DireccionService, informacionAdicionalService: InformacionAdicionalService,
                archivoService: ArchivoService, observacionService: ObservacionService, etiquetaService: EtiquetaService,
                variableService: VariableService, variableCuentaService: VariableCuentaService, vinculoVehiculoService: VinculoVehiculoService,
                zonaEntregaService: ZonaEntregaService, controladorCuentaService: ControladorCuentaService, condicionEspecialService: CondicionEspecialService,
                recargoDescuentoService: RecargoDescuentoService, debitoAutomaticoService: DebitoAutomaticoService, 
                incisoVehiculoService: IncisoVehiculoService
    ) {
        this.vehiculoRepository = vehiculoRepository;
        this.contribuyenteService = contribuyenteService;
        this.cuentaService = cuentaService;
        this.relacionCuentaService = relacionCuentaService;
        this.direccionService = direccionService;
        this.informacionAdicionalService = informacionAdicionalService;
        this.archivoService = archivoService;
        this.observacionService = observacionService;
        this.etiquetaService = etiquetaService;
        this.variableService = variableService;
        this.variableCuentaService = variableCuentaService;
        this.vinculoVehiculoService = vinculoVehiculoService;
        this.zonaEntregaService = zonaEntregaService;
        this.controladorCuentaService = controladorCuentaService;
        this.condicionEspecialService = condicionEspecialService;
        this.recargoDescuentoService = recargoDescuentoService;
        this.debitoAutomaticoService = debitoAutomaticoService;
        this.incisoVehiculoService = incisoVehiculoService
    }

    async listByCuenta(vehiculoFilter: VehiculoFilter) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = (await this.vehiculoRepository.listByCuenta(vehiculoFilter) as Array<VehiculoRow>).sort((a, b) => a.id - b.id);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async listByDatos(vehiculoFilter: VehiculoFilter) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = (await this.vehiculoRepository.listByDatos(vehiculoFilter) as Array<VehiculoRow>).sort((a, b) => a.id - b.id);
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
                let vehiculoDTO = new VehiculoDTO();            
                vehiculoDTO.vehiculo = await this.vehiculoRepository.findById(id) as Vehiculo;
                if (!vehiculoDTO.vehiculo) {
                    reject(new ReferenceError('No existe el registro'));
                    return;
                }
                let idCuenta = vehiculoDTO.vehiculo.idCuenta;

                vehiculoDTO.cuenta = await this.cuentaService.findById(vehiculoDTO.vehiculo.idCuenta) as Cuenta;
                vehiculoDTO.relacionesCuentas = await this.relacionCuentaService.listByCuenta(idCuenta) as Array<RelacionCuentaState>;
                vehiculoDTO.archivos = await this.archivoService.listByVehiculo(id) as Array<ArchivoState>;
                vehiculoDTO.observaciones = await this.observacionService.listByVehiculo(id) as Array<ObservacionState>;
                vehiculoDTO.etiquetas = await this.etiquetaService.listByVehiculo(id) as Array<EtiquetaState>;
                vehiculoDTO.variablesCuenta = await this.variableCuentaService.listByCuenta(idCuenta) as Array<VariableCuentaState>;
                vehiculoDTO.vinculosVehiculo = await this.vinculoVehiculoService.listByVehiculo(id) as Array<VinculoVehiculoState>;
                vehiculoDTO.zonasEntrega = await this.zonaEntregaService.listByCuenta(idCuenta) as Array<ZonaEntregaState>;
                vehiculoDTO.controladoresCuentas = await this.controladorCuentaService.listByCuenta(idCuenta) as Array<ControladorCuentaState>;
                vehiculoDTO.condicionesEspeciales = await this.condicionEspecialService.listByCuenta(idCuenta) as Array<CondicionEspecialState>;
                vehiculoDTO.recargosDescuentos = await this.recargoDescuentoService.listByCuenta(idCuenta) as Array<RecargoDescuentoState>;
                vehiculoDTO.debitosAutomaticos = await this.debitoAutomaticoService.listByCuenta(idCuenta) as Array<DebitoAutomaticoState>;
                
                resolve(vehiculoDTO);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async add(vehiculoDTO: VehiculoDTO) {
        const resultTransaction = this.vehiculoRepository.onTransaction( async () => {
            return new Promise( async (resolve, reject) => {
                try {
                    let idIncisoVehiculo = vehiculoDTO.vehiculo.idIncisoVehiculo; 
                    const listaInciso = await this.incisoVehiculoService.list() as Array<IncisoVehiculo>;
                    const isVehiculoMenor = listaInciso.find(f => f.id === idIncisoVehiculo).vehiculoMenor;  

                    if (!isValidInteger(vehiculoDTO.vehiculo.idEstadoCarga, true) ||
                        !isValidString(vehiculoDTO.vehiculo.dominio, true) ||
                        !isVehiculoMenor && !isValidString(vehiculoDTO.vehiculo.dominioAnterior, false) ||
                        !isValidString(vehiculoDTO.vehiculo.anioModelo, true) ||
                        !isValidString(vehiculoDTO.vehiculo.marca, true) ||
                        !isVehiculoMenor && !isValidString(vehiculoDTO.vehiculo.codigoMarca, true) ||
                        !isValidString(vehiculoDTO.vehiculo.modelo, true) ||
                        !isValidInteger(vehiculoDTO.vehiculo.idIncisoVehiculo, true) ||
                        !isValidInteger(vehiculoDTO.vehiculo.idTipoVehiculo, true) ||
                        !isValidInteger(vehiculoDTO.vehiculo.idCategoriaVehiculo, true) ||
                        !isValidString(vehiculoDTO.vehiculo.numeroMotor, true) ||
                        !isValidString(vehiculoDTO.vehiculo.marcaMotor, true) ||
                        !isValidString(vehiculoDTO.vehiculo.numeroChasis, true) ||
                        !isValidString(vehiculoDTO.vehiculo.serieMotor, true) ||
                        !isValidString(vehiculoDTO.vehiculo.legajo, true) ||
                        !isValidFloat(vehiculoDTO.vehiculo.valuacion, true) ||
                        !isVehiculoMenor && !isValidString(vehiculoDTO.vehiculo.peso, true) ||
                        !isVehiculoMenor && !isValidString(vehiculoDTO.vehiculo.carga, false) ||
                        isVehiculoMenor && !isValidString(vehiculoDTO.vehiculo.cilindrada, true) ||
                        !isValidInteger(vehiculoDTO.vehiculo.idOrigenFabricacion, true) ||
                        !isValidInteger(vehiculoDTO.vehiculo.idCombustible, true) ||
                        !isValidInteger(vehiculoDTO.vehiculo.idUsoVehiculo, true) ||
                        !isValidInteger(vehiculoDTO.vehiculo.idMotivoBajaVehiculo, false) ||
                        !isValidString(vehiculoDTO.vehiculo.recupero, true) ||
                        !isValidString(vehiculoDTO.vehiculo.radicacionAnterior, false) ||
                        !isValidDate(vehiculoDTO.vehiculo.fechaAlta, false) ||
                        !isValidDate(vehiculoDTO.vehiculo.fechaPatentamiento, false) ||
                        !isValidDate(vehiculoDTO.vehiculo.fechaRadicacion, false) ||
                        !isValidDate(vehiculoDTO.vehiculo.fechaTransferencia, false) ||
                        !isValidDate(vehiculoDTO.vehiculo.fechaCompra, false) ||
                        !isValidDate(vehiculoDTO.vehiculo.fechaBaja, false) ||
                        !isValidDate(vehiculoDTO.vehiculo.fechaHabilitacionDesde, false) ||
                        !isValidDate(vehiculoDTO.vehiculo.fechaHabilitacionHasta, false) ||
                        !isValidDate(vehiculoDTO.vehiculo.fechaDDJJ, false)                
                    ) {
                        reject(new ValidationError('Existen campos incompletos'));
                        return;
                    }
                    
                    vehiculoDTO.vehiculo.idCuenta = null;
                    vehiculoDTO.vehiculo.idEstadoCarga = 20; //Incompleta
                    vehiculoDTO.vehiculo.fechaCargaInicio = getDateNow();
                    vehiculoDTO.vehiculo.fechaCargaFin = null;
                    vehiculoDTO.vehiculo = await this.vehiculoRepository.add(vehiculoDTO.vehiculo) as Vehiculo;

                    vehiculoDTO.cuenta.idTipoTributo = 12; //12: Vehiculo
                    vehiculoDTO.cuenta.idTributo = vehiculoDTO.vehiculo.id;
                    vehiculoDTO.cuenta.idEstadoCuenta = 1; //Pendiente
                    vehiculoDTO.cuenta = await this.cuentaService.add(vehiculoDTO.cuenta) as Cuenta;

                    vehiculoDTO.vehiculo.idCuenta = vehiculoDTO.cuenta.id;
                    await this.vehiculoRepository.modify(vehiculoDTO.vehiculo.id, vehiculoDTO.vehiculo);

                    resolve(vehiculoDTO);
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
            });
		});
		return resultTransaction;
    }

    async modify(id: number, idUsuario: number, vehiculoDTO: VehiculoDTO) {
        const resultTransaction = this.vehiculoRepository.onTransaction( async () => {
            return new Promise( async (resolve, reject) => {
                try {
                    let idIncisoVehiculo = vehiculoDTO.vehiculo.idIncisoVehiculo; 
                    const listaInciso = await this.incisoVehiculoService.list() as Array<IncisoVehiculo>;
                    const isVehiculoMenor = listaInciso.find(f => f.id === idIncisoVehiculo).vehiculoMenor;  

                    if (!isValidInteger(vehiculoDTO.vehiculo.idCuenta, true) ||
                        !isValidString(vehiculoDTO.vehiculo.dominio, true) ||
                        !isVehiculoMenor && !isValidString(vehiculoDTO.vehiculo.dominioAnterior, false) ||
                        !isValidString(vehiculoDTO.vehiculo.anioModelo, true) ||
                        !isValidString(vehiculoDTO.vehiculo.marca, true) ||
                        !isVehiculoMenor && !isValidString(vehiculoDTO.vehiculo.codigoMarca, true) ||
                        !isValidString(vehiculoDTO.vehiculo.modelo, true) ||
                        !isValidInteger(vehiculoDTO.vehiculo.idIncisoVehiculo, true) ||
                        !isValidInteger(vehiculoDTO.vehiculo.idTipoVehiculo, true) ||
                        !isValidInteger(vehiculoDTO.vehiculo.idCategoriaVehiculo, true) ||
                        !isValidString(vehiculoDTO.vehiculo.numeroMotor, true) ||
                        !isValidString(vehiculoDTO.vehiculo.marcaMotor, true) ||
                        !isValidString(vehiculoDTO.vehiculo.numeroChasis, true) ||
                        !isValidString(vehiculoDTO.vehiculo.serieMotor, true) ||
                        !isValidString(vehiculoDTO.vehiculo.legajo, true) ||
                        !isValidFloat(vehiculoDTO.vehiculo.valuacion, true) ||
                        !isVehiculoMenor && !isValidString(vehiculoDTO.vehiculo.peso, true) ||
                        !isVehiculoMenor && !isValidString(vehiculoDTO.vehiculo.carga, false) ||
                        isVehiculoMenor && !isValidString(vehiculoDTO.vehiculo.cilindrada, true) ||
                        !isValidInteger(vehiculoDTO.vehiculo.idOrigenFabricacion, true) ||
                        !isValidInteger(vehiculoDTO.vehiculo.idCombustible, true) ||
                        !isValidInteger(vehiculoDTO.vehiculo.idUsoVehiculo, true) ||
                        !isValidInteger(vehiculoDTO.vehiculo.idMotivoBajaVehiculo, false) ||
                        !isValidString(vehiculoDTO.vehiculo.recupero, true) ||
                        !isValidString(vehiculoDTO.vehiculo.radicacionAnterior, false) ||
                        !isValidDate(vehiculoDTO.vehiculo.fechaAlta, false) ||
                        !isValidDate(vehiculoDTO.vehiculo.fechaPatentamiento, false) ||
                        !isValidDate(vehiculoDTO.vehiculo.fechaRadicacion, false) ||
                        !isValidDate(vehiculoDTO.vehiculo.fechaTransferencia, false) ||
                        !isValidDate(vehiculoDTO.vehiculo.fechaCompra, false) ||
                        !isValidDate(vehiculoDTO.vehiculo.fechaBaja, false) ||
                        !isValidDate(vehiculoDTO.vehiculo.fechaHabilitacionDesde, false) ||
                        !isValidDate(vehiculoDTO.vehiculo.fechaHabilitacionHasta, false) ||
                        !isValidDate(vehiculoDTO.vehiculo.fechaDDJJ, false)            
                    ) {
                        reject(new ValidationError('Existen campos incompletos'));
                        return;
                    }

                    //los contribuyentes surgen entre responsables de cuenta y titulares (debe haber al menos un contribuyente)
                    let vinculosContribuyente = vehiculoDTO.vinculosVehiculo.filter(f => [70,71].includes(f.idTipoVinculoVehiculo) && f.state !== 'r');
                    vinculosContribuyente.sort((a,b) =>a.idTipoVinculoVehiculo - b.idTipoVinculoVehiculo);
                    if (vinculosContribuyente.length === 0) {
                        reject(new ValidationError('Debe vincular al menos un titular o responsable de cuenta'));
                        return;
                    }
                    let idCuenta = vehiculoDTO.vehiculo.idCuenta;

                    //si hubo algun cambio, entonces valido la consistencia de los rangos de fechas de las variables
                    if (vehiculoDTO.variablesCuenta.filter(f => f.state !== 'o').length > 0) {
                        if (!this.variableCuentaService.validateDateRange(vehiculoDTO.variablesCuenta)) {
                            reject(new ValidationError(`Existen rangos de fechas de variables que se superponen`));
                            return;
                        }
                    }

                    //EstadoCarga => 20: Incompleta y 21:Completa
                    //EstadoCuenta => 1: Pendiente y 2:Activa
                    if (vehiculoDTO.vehiculo.idMotivoBajaVehiculo === 0) vehiculoDTO.vehiculo.idMotivoBajaVehiculo = null;
                    vehiculoDTO.vehiculo.fechaCargaFin = (vehiculoDTO.vehiculo.idEstadoCarga == 21) ? getDateNow() : null;
                    vehiculoDTO.vehiculo = await this.vehiculoRepository.modify(id, vehiculoDTO.vehiculo) as Vehiculo;
                    
                    vehiculoDTO.cuenta.idEstadoCuenta = (vehiculoDTO.vehiculo.idEstadoCarga == 20) ? 1 : 2;
                    vehiculoDTO.cuenta = await this.cuentaService.modify(idCuenta, vehiculoDTO.cuenta) as Cuenta;

                    let logAddAsyncPrimario = [];
                    let logAddAsyncSecundario = [];
                    let requestAdd = [];
                    let requestOther = [];

                    //verifico si tengo que hacer cambios (ya que vehiculoDTO.vinculosVehiculo incluye registros originales)
                    const contribuyentesUpdates = vehiculoDTO.vinculosVehiculo.filter(f => f.state !== 'o').length;
                    if (contribuyentesUpdates > 0) {
                        const personasContribuyenteIDs = distinctArray(vinculosContribuyente.map(x => x.idPersona));
                        const personasVinculo: Array<PersonaMin> = vehiculoDTO.vinculosVehiculo.map(vinculo => {
                            const persona = new PersonaMin();
                            persona.setFromObject({...vinculo});
                            return persona;
                        }) as Array<PersonaMin>;
                        await this.cuentaService.updateContribuyentes(idCuenta, personasVinculo, personasContribuyenteIDs);
                    }

                    //como viajan todos, tengo que filtrar ahora
                    vehiculoDTO.vinculosVehiculo.filter(f => f.state !== 'o').forEach(async row => {
                        if (row.state === 'a') {
                            logAddAsyncPrimario.push({entity: 'VinculoVehiculo', idSource: row.id});
                            requestAdd.push(this.vinculoVehiculoService.add(row as VinculoVehiculo));
                        }
                        else if (row.state === 'm') {
                            requestOther.push(this.vinculoVehiculoService.modify(row.id, row as VinculoVehiculo));
                        }
                        else if (row.state === 'r') {
                            requestOther.push(this.vinculoVehiculoService.remove(row.id));
                        }
                    });
                    //como viajan todos, tengo que filtrar ahora
                    vehiculoDTO.variablesCuenta.forEach(async row => {
                        if (row.state === 'a') {
                            requestOther.push(this.variableCuentaService.add(row as VariableCuenta));
                        }
                        else if (row.state === 'm') {
                            requestOther.push(this.variableCuentaService.modify(row.id, row as VariableCuenta));
                        }
                        else if (row.state === 'r') {
                            requestOther.push(this.variableCuentaService.remove(row.id));
                        }
                    });

                    vehiculoDTO.relacionesCuentas.forEach(async row => {
                        if (row.state === 'a') {
                            logAddAsyncPrimario.push({entity: 'RelacionCuenta', idSource: row.id});
                            requestAdd.push(this.relacionCuentaService.add(row as RelacionCuenta));
                        }
                        else if (row.state === 'r') {
                            requestOther.push(this.relacionCuentaService.remove(row.id));
                        }
                    });


                    vehiculoDTO.zonasEntrega.forEach(async row => {
                        if (row.state === 'a') {
                            logAddAsyncPrimario.push({entity: 'ZonaEntrega', idSource: row.id});
                            requestAdd.push(new Promise(async (resolve2, reject2) => {
                                try {
                                    //alta de la zona de entrega
                                    const zonaEntrega = await this.zonaEntregaService.add(row as ZonaEntrega) as ZonaEntrega;

                                    let requestAdd2 = [];
                                    const offset_logAddAsyncSecundario = logAddAsyncSecundario.length;
                                    //alta de la direccion
                                    row.direccion.idEntidad = zonaEntrega.id;
                                    logAddAsyncSecundario.push({entity: 'Direccion', idSource: row.direccion.id});
                                    requestAdd2.push(this.direccionService.add(row.direccion as Direccion, row.email.length > 0));

                                    Promise.all(requestAdd2)
                                    .then(responses2 => {
                                        //actualizo las id definitivas (para las altas)
                                        for(let i=0; i<responses2.length; i++) {
                                            logAddAsyncSecundario[offset_logAddAsyncSecundario + i].idTarget = responses2[i].id;
                                        }
                                        resolve2(zonaEntrega);
                                    })
                                    .catch(reject2);
                                }
                                catch(error) {
                                    if (error instanceof ValidationError ||
                                        error instanceof ProcessError ||
                                        error instanceof ReferenceError) {
                                        reject2(error);
                                    }
                                    else {
                                        reject2(new ProcessError('Error procesando datos', error));
                                    }
                                }
                            }));
                        }
                        else if (row.state === 'm') {
                            requestOther.push(this.zonaEntregaService.modify(row.id, row as ZonaEntrega));
                            requestOther.push(this.direccionService.modify(row.direccion.id, row.direccion as Direccion, row.email.length > 0));
                        }
                        else if (row.state === 'r') {
                            requestOther.push(this.zonaEntregaService.remove(row.id));
                        }
                    });

                    vehiculoDTO.controladoresCuentas.forEach(async row => {
                        if (row.state === 'a') {
                            logAddAsyncPrimario.push({entity: 'ControladorCuenta', idSource: row.id});
                            requestAdd.push(this.controladorCuentaService.add(row as ControladorCuenta));
                        }
                        else if (row.state === 'm') {
                            requestOther.push(this.controladorCuentaService.modify(row.id, row as ControladorCuenta));
                        }
                        else if (row.state === 'r') {
                            requestOther.push(this.controladorCuentaService.remove(row.id));
                        }
                    });

                    vehiculoDTO.condicionesEspeciales.forEach(async row => {
                        if (row.state === 'a') {
                            logAddAsyncPrimario.push({entity: 'CondicionEspecial', idSource: row.id});
                            requestAdd.push(this.condicionEspecialService.add(row as CondicionEspecial));
                        }
                        else if (row.state === 'm') {
                            requestOther.push(this.condicionEspecialService.modify(row.id, row as CondicionEspecial));
                        }
                        else if (row.state === 'r') {
                            requestOther.push(this.condicionEspecialService.remove(row.id));
                        }
                    });

                    vehiculoDTO.recargosDescuentos.forEach(async row => {
                        if (row.state === 'a') {
                            logAddAsyncPrimario.push({entity: 'RecargoDescuento', idSource: row.id});
                            requestAdd.push(this.recargoDescuentoService.add(row as RecargoDescuento));
                        }
                        else if (row.state === 'm') {
                            requestOther.push(this.recargoDescuentoService.modify(row.id, row as RecargoDescuento));
                        }
                        else if (row.state === 'r') {
                            requestOther.push(this.recargoDescuentoService.remove(row.id));
                        }
                    });

                    vehiculoDTO.debitosAutomaticos.forEach(async row => {
                        if (row.state === 'a') {
                            logAddAsyncPrimario.push({entity: 'DebitoAutomatico', idSource: row.id});
                            requestAdd.push(this.debitoAutomaticoService.add(row as DebitoAutomatico));
                        }
                        else if (row.state === 'm') {
                            requestOther.push(this.debitoAutomaticoService.modify(row.id, row as DebitoAutomatico));
                        }
                        else if (row.state === 'r') {
                            requestOther.push(this.debitoAutomaticoService.remove(row.id));
                        }
                    });


                    Promise.all(requestAdd)
                    .then(responses => {
                        //actualizo las id definitivas (para las altas)
                        for(let i=0; i<responses.length; i++) {
                            logAddAsyncPrimario[i].idTarget = responses[i].id;
                        }

                        Promise.all(requestOther)
                        .then(async responses => {
                            //verifico el domicilio entrega
                            if (vehiculoDTO.zonasEntrega.length > 0) {
                                await this.cuentaService.updateDireccionEntrega(idCuenta);
                            }

                            //unifico los logs
                            const logAdd = logAddAsyncPrimario.concat(logAddAsyncSecundario);
                            //proceso los archivos, observaciones y etiquetas
                            let informacionAdicionalDTO = new InformacionAdicionalDTO(vehiculoDTO.archivos, vehiculoDTO.observaciones, vehiculoDTO.etiquetas);
                            this.informacionAdicionalService.modifyFixId(idUsuario, informacionAdicionalDTO, logAdd)
                            .then(responses => {
                                this.findById(id).then(resolve).catch(reject);
                            })
                            .catch((error) => {
                                reject(error);
                            });

                        })
                        .catch((error) => {
                            reject(error);
                        });

                    })
                    .catch((error) => {
                        reject(error);
                    });

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
            });
		});
		return resultTransaction;
    }

    async remove(id: number) {
        const resultTransaction = this.vehiculoRepository.onTransaction( async () => {
            return new Promise( async (resolve, reject) => {
                try {
                    let vehiculoDTO = new VehiculoDTO();            
                    vehiculoDTO.vehiculo = await this.vehiculoRepository.findById(id) as Vehiculo;
                    if (!vehiculoDTO.vehiculo) {
                        reject(new ReferenceError('No existe el registro'));
                        return;
                    }
                    let idCuenta = vehiculoDTO.vehiculo.idCuenta;

                    await this.cuentaService.unbindAllContribuyentes(idCuenta);
                    await this.variableCuentaService.removeByCuenta(idCuenta);
                    await this.vinculoVehiculoService.removeByVehiculo(id);
                    await this.relacionCuentaService.removeByCuenta(idCuenta);
                    await this.zonaEntregaService.removeByCuenta(idCuenta);
                    await this.controladorCuentaService.removeByCuenta(idCuenta);
                    await this.condicionEspecialService.removeByCuenta(idCuenta);
                    await this.recargoDescuentoService.removeByCuenta(idCuenta);
                    await this.debitoAutomaticoService.removeByCuenta(idCuenta);

                    const vehiculo = await this.vehiculoRepository.findById(id);
                    if (!vehiculo) {
                        reject(new ReferenceError('No existe el registro'));
                        return;
                    }
                    const result = await this.vehiculoRepository.remove(id);
                    if (!result) {
                        reject(new ReferenceError('No existe el registro'));
                        return;
                    }
                    await this.cuentaService.remove(vehiculo.idCuenta);
                    resolve(result);
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
            });
		});
		return resultTransaction;
    }
    
}
