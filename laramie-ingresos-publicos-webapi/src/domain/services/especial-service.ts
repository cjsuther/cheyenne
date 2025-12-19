import Especial from '../entities/especial';
import Cuenta from '../entities/cuenta';
import RelacionCuenta from '../entities/relacion-cuenta';
import Direccion from '../entities/direccion';
import VariableCuenta from '../entities/variable-cuenta';
import VinculoEspecial from '../entities/vinculo-especial';
import ZonaEntrega from '../entities/zona-entrega';
import ControladorCuenta from '../entities/controlador-cuenta';
import CondicionEspecial from '../entities/condicion-especial';
import RecargoDescuento from '../entities/recargo-descuento';
import DebitoAutomatico from '../entities/debito-automatico';

import EspecialRow from '../dto/especial-row';
import EspecialFilter from '../dto/especial-filter';
import EspecialDTO from '../dto/especial-dto';
import RelacionCuentaState from '../dto/relacion-cuenta-state';
import InformacionAdicionalDTO from '../dto/informacion-adicional-dto';
import RelacionCuentaService from './relacion-cuenta-service';
import ArchivoState from '../dto/archivo-state';
import ObservacionState from '../dto/observacion-state';
import EtiquetaState from '../dto/etiqueta-state';
import VariableCuentaState from '../dto/variable-cuenta-state';
import VinculoEspecialState from '../dto/vinculo-especial-state';
import ZonaEntregaState from '../dto/zona-entrega-state';
import ControladorCuentaState from '../dto/controlador-cuenta-state';
import CondicionEspecialState from '../dto/condicion-especial-state';
import RecargoDescuentoState from '../dto/recargo-descuento-state';
import DebitoAutomaticoState from '../dto/debito-automatico-state';

import IEspecialRepository from '../repositories/especial-repository';
import ContribuyenteService from './contribuyente-service';
import CuentaService from './cuenta-service';
import DireccionService from './direccion-service';
import InformacionAdicionalService from './informacion-adicional-service';
import ArchivoService from './archivo-service';
import ObservacionService from './observacion-service';
import EtiquetaService from './etiqueta-service';
import VariableService from './variable-service';
import VariableCuentaService from './variable-cuenta-service';
import VinculoEspecialService from './vinculo-especial-service';
import ZonaEntregaService from './zona-entrega-service';
import ControladorCuentaService from './controlador-cuenta-service';
import CondicionEspecialService from './condicion-especial-service';
import RecargoDescuentoService from './recargo-descuento-service';
import DebitoAutomaticoService from './debito-automatico-service';

import { isValidInteger } from '../../infraestructure/sdk/utils/validator';
import { getDateNow } from '../../infraestructure/sdk/utils/convert';
import { distinctArray } from '../../infraestructure/sdk/utils/helper';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import PersonaMin from '../dto/persona-min';


export default class EspecialService {

    especialRepository: IEspecialRepository;
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
    vinculoEspecialService: VinculoEspecialService;
    zonaEntregaService: ZonaEntregaService;
    controladorCuentaService: ControladorCuentaService;
    condicionEspecialService: CondicionEspecialService;
    recargoDescuentoService: RecargoDescuentoService;
    debitoAutomaticoService: DebitoAutomaticoService;

    constructor(especialRepository: IEspecialRepository, contribuyenteService: ContribuyenteService, cuentaService: CuentaService, relacionCuentaService: RelacionCuentaService,
                direccionService: DireccionService, informacionAdicionalService: InformacionAdicionalService,
                archivoService: ArchivoService, observacionService: ObservacionService, etiquetaService: EtiquetaService,
                variableService: VariableService, variableCuentaService: VariableCuentaService, vinculoEspecialService: VinculoEspecialService,
                zonaEntregaService: ZonaEntregaService, controladorCuentaService: ControladorCuentaService, condicionEspecialService: CondicionEspecialService,
                recargoDescuentoService: RecargoDescuentoService, debitoAutomaticoService: DebitoAutomaticoService
    ) {
        this.especialRepository = especialRepository;
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
        this.vinculoEspecialService = vinculoEspecialService;
        this.zonaEntregaService = zonaEntregaService;
        this.controladorCuentaService = controladorCuentaService;
        this.condicionEspecialService = condicionEspecialService;
        this.recargoDescuentoService = recargoDescuentoService;
        this.debitoAutomaticoService = debitoAutomaticoService;
    }

    async listByCuenta(especialFilter: EspecialFilter) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = (await this.especialRepository.listByCuenta(especialFilter) as Array<EspecialRow>).sort((a, b) => a.id - b.id);
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
                let especialDTO = new EspecialDTO();            
                especialDTO.especial = await this.especialRepository.findById(id) as Especial;
                if (!especialDTO.especial) {
                    reject(new ReferenceError('No existe el registro'));
                    return;
                }
                let idCuenta = especialDTO.especial.idCuenta;

                especialDTO.cuenta = await this.cuentaService.findById(especialDTO.especial.idCuenta) as Cuenta;
                especialDTO.relacionesCuentas = await this.relacionCuentaService.listByCuenta(idCuenta) as Array<RelacionCuentaState>;
                especialDTO.archivos = await this.archivoService.listByEspecial(id) as Array<ArchivoState>;
                especialDTO.observaciones = await this.observacionService.listByEspecial(id) as Array<ObservacionState>;
                especialDTO.etiquetas = await this.etiquetaService.listByEspecial(id) as Array<EtiquetaState>;
                especialDTO.variablesCuenta = await this.variableCuentaService.listByCuenta(idCuenta) as Array<VariableCuentaState>;
                especialDTO.vinculosEspecial = await this.vinculoEspecialService.listByEspecial(id) as Array<VinculoEspecialState>;
                especialDTO.zonasEntrega = await this.zonaEntregaService.listByCuenta(idCuenta) as Array<ZonaEntregaState>;
                especialDTO.controladoresCuentas = await this.controladorCuentaService.listByCuenta(idCuenta) as Array<ControladorCuentaState>;
                especialDTO.condicionesEspeciales = await this.condicionEspecialService.listByCuenta(idCuenta) as Array<CondicionEspecialState>;
                especialDTO.recargosDescuentos = await this.recargoDescuentoService.listByCuenta(idCuenta) as Array<RecargoDescuentoState>;
                especialDTO.debitosAutomaticos = await this.debitoAutomaticoService.listByCuenta(idCuenta) as Array<DebitoAutomaticoState>;

                resolve(especialDTO);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async add(especialDTO: EspecialDTO) {
        const resultTransaction = this.especialRepository.onTransaction( async () => {
            return new Promise( async (resolve, reject) => {
                try {
                    if (!isValidInteger(especialDTO.especial.idEstadoCarga, true)
                    ) {
                        reject(new ValidationError('Existen campos incompletos'));
                        return;
                    }
                    
                    especialDTO.especial.idCuenta = null;
                    especialDTO.especial.idEstadoCarga = 20; //Incompleta
                    especialDTO.especial.fechaCargaInicio = getDateNow();
                    especialDTO.especial.fechaCargaFin = null;
                    especialDTO.especial = await this.especialRepository.add(especialDTO.especial) as Especial;

                    especialDTO.cuenta.idTipoTributo = 15; //15: Cuentas Especiales
                    especialDTO.cuenta.idTributo = especialDTO.especial.id;
                    especialDTO.cuenta.idEstadoCuenta = 1; //Pendiente
                    especialDTO.cuenta = await this.cuentaService.add(especialDTO.cuenta) as Cuenta;

                    especialDTO.especial.idCuenta = especialDTO.cuenta.id;
                    await this.especialRepository.modify(especialDTO.especial.id, especialDTO.especial);

                    resolve(especialDTO);
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

    async modify(id: number, idUsuario: number, especialDTO: EspecialDTO) {
        const resultTransaction = this.especialRepository.onTransaction( async () => {
            return new Promise( async (resolve, reject) => {
                try {
                    if (!isValidInteger(especialDTO.especial.idCuenta, true)
                    ) {
                        reject(new ValidationError('Existen campos incompletos'));
                        return;
                    }

                    //los contribuyentes surgen entre responsables de cuenta y titulares (debe haber al menos un contribuyente)
                    let vinculosContribuyente = especialDTO.vinculosEspecial.filter(f => [100,101].includes(f.idTipoVinculoEspecial) && f.state !== 'r');
                    vinculosContribuyente.sort((a,b) =>a.idTipoVinculoEspecial - b.idTipoVinculoEspecial);
                    if (vinculosContribuyente.length === 0) {
                        reject(new ValidationError('Debe vincular al menos un titular o responsable de cuenta'));
                        return;
                    }
                    let idCuenta = especialDTO.especial.idCuenta;

                    //si hubo algun cambio, entonces valido la consistencia de los rangos de fechas de las variables
                    if (especialDTO.variablesCuenta.filter(f => f.state !== 'o').length > 0) {
                        if (!this.variableCuentaService.validateDateRange(especialDTO.variablesCuenta)) {
                            reject(new ValidationError(`Existen rangos de fechas de variables que se superponen`));
                            return;
                        }
                    }

                    //EstadoCarga => 20: Incompleta y 21:Completa
                    //EstadoCuenta => 1: Pendiente y 2:Activa
                    especialDTO.especial.fechaCargaFin = (especialDTO.especial.idEstadoCarga == 21) ? getDateNow() : null;
                    especialDTO.especial = await this.especialRepository.modify(id, especialDTO.especial) as Especial;
                    
                    especialDTO.cuenta.idEstadoCuenta = (especialDTO.especial.idEstadoCarga == 20) ? 1 : 2;
                    especialDTO.cuenta = await this.cuentaService.modify(idCuenta, especialDTO.cuenta) as Cuenta;

                    let logAddAsyncPrimario = [];
                    let logAddAsyncSecundario = [];
                    let requestAdd = [];
                    let requestOther = [];

                    //verifico si tengo que hacer cambios (ya que especialDTO.vinculosEspecial incluye registros originales)
                    const contribuyentesUpdates = especialDTO.vinculosEspecial.filter(f => f.state !== 'o').length;
                    if (contribuyentesUpdates > 0) {
                        const personasContribuyenteIDs = distinctArray(vinculosContribuyente.map(x => x.idPersona));
                        const personasVinculo: Array<PersonaMin> = especialDTO.vinculosEspecial.map(vinculo => {
                            const persona = new PersonaMin();
                            persona.setFromObject({...vinculo});
                            return persona;
                        }) as Array<PersonaMin>;
                        await this.cuentaService.updateContribuyentes(idCuenta, personasVinculo, personasContribuyenteIDs);
                    }

                    //como viajan todos, tengo que filtrar ahora
                    especialDTO.vinculosEspecial.filter(f => f.state !== 'o').forEach(async row => {
                        if (row.state === 'a') {
                            logAddAsyncPrimario.push({entity: 'VinculoEspecial', idSource: row.id});
                            requestAdd.push(this.vinculoEspecialService.add(row as VinculoEspecial));
                        }
                        else if (row.state === 'm') {
                            requestOther.push(this.vinculoEspecialService.modify(row.id, row as VinculoEspecial));
                        }
                        else if (row.state === 'r') {
                            requestOther.push(this.vinculoEspecialService.remove(row.id));
                        }
                    });
                    //como viajan todos, tengo que filtrar ahora
                    especialDTO.variablesCuenta.filter(f => f.state !== 'o').forEach(async row => {
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

                    especialDTO.relacionesCuentas.forEach(async row => {
                        if (row.state === 'a') {
                            logAddAsyncPrimario.push({entity: 'RelacionCuenta', idSource: row.id});
                            requestAdd.push(this.relacionCuentaService.add(row as RelacionCuenta));
                        }
                        else if (row.state === 'r') {
                            requestOther.push(this.relacionCuentaService.remove(row.id));
                        }
                    });


                    especialDTO.zonasEntrega.forEach(async row => {
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

                    especialDTO.controladoresCuentas.forEach(async row => {
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

                    especialDTO.condicionesEspeciales.forEach(async row => {
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

                    especialDTO.recargosDescuentos.forEach(async row => {
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

                    especialDTO.debitosAutomaticos.forEach(async row => {
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
                            if (especialDTO.zonasEntrega.length > 0) {
                                await this.cuentaService.updateDireccionEntrega(idCuenta);
                            }
                            
                            //unifico los logs
                            const logAdd = logAddAsyncPrimario.concat(logAddAsyncSecundario);
                            //proceso los archivos, observaciones y etiquetas
                            let informacionAdicionalDTO = new InformacionAdicionalDTO(especialDTO.archivos, especialDTO.observaciones, especialDTO.etiquetas);
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
        const resultTransaction = this.especialRepository.onTransaction( async () => {
            return new Promise( async (resolve, reject) => {
                try {
                    let especialDTO = new EspecialDTO();            
                    especialDTO.especial = await this.especialRepository.findById(id) as Especial;
                    if (!especialDTO.especial) {
                        reject(new ReferenceError('No existe el registro'));
                        return;
                    }
                    let idCuenta = especialDTO.especial.idCuenta;

                    await this.cuentaService.unbindAllContribuyentes(idCuenta);
                    await this.variableCuentaService.removeByCuenta(idCuenta);
                    await this.vinculoEspecialService.removeByEspecial(id);
                    await this.relacionCuentaService.removeByCuenta(idCuenta);
                    await this.zonaEntregaService.removeByCuenta(idCuenta);
                    await this.controladorCuentaService.removeByCuenta(idCuenta);
                    await this.condicionEspecialService.removeByCuenta(idCuenta);
                    await this.recargoDescuentoService.removeByCuenta(idCuenta);
                    await this.debitoAutomaticoService.removeByCuenta(idCuenta);

                    const especial = await this.especialRepository.findById(id);
                    if (!especial) {
                        reject(new ReferenceError('No existe el registro'));
                        return;
                    }
                    const result = await this.especialRepository.remove(id);
                    if (!result) {
                        reject(new ReferenceError('No existe el registro'));
                        return;
                    }
                    await this.cuentaService.remove(especial.idCuenta);
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
