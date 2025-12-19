import Comercio from '../entities/comercio';
import Cuenta from '../entities/cuenta';
import RelacionCuenta from '../entities/relacion-cuenta';
import Direccion from '../entities/direccion';
import VariableCuenta from '../entities/variable-cuenta';
import VinculoComercio from '../entities/vinculo-comercio';
import Inspeccion from '../entities/inspeccion';
import ZonaEntrega from '../entities/zona-entrega';
import ControladorCuenta from '../entities/controlador-cuenta';
import CondicionEspecial from '../entities/condicion-especial';
import RecargoDescuento from '../entities/recargo-descuento';
import DebitoAutomatico from '../entities/debito-automatico';
import RubroComercio from '../entities/rubro-comercio';
import Elemento from '../entities/elemento';

import ComercioRow from '../dto/comercio-row';
import ComercioFilter from '../dto/comercio-filter';
import ComercioDTO from '../dto/comercio-dto';
import RelacionCuentaState from '../dto/relacion-cuenta-state';
import InformacionAdicionalDTO from '../dto/informacion-adicional-dto';
import ArchivoState from '../dto/archivo-state';
import ObservacionState from '../dto/observacion-state';
import EtiquetaState from '../dto/etiqueta-state';
import VariableCuentaState from '../dto/variable-cuenta-state';
import VinculoComercioState from '../dto/vinculo-comercio-state';
import InspeccionState from '../dto/inspeccion-state';
import ZonaEntregaState from '../dto/zona-entrega-state';
import ControladorCuentaState from '../dto/controlador-cuenta-state';
import CondicionEspecialState from '../dto/condicion-especial-state';
import RecargoDescuentoState from '../dto/recargo-descuento-state';
import DebitoAutomaticoState from '../dto/debito-automatico-state';
import RubroComercioState from '../dto/rubro-comercio-state';
import ElementoState from '../dto/elemento-state';

import IComercioRepository from '../repositories/comercio-repository';
import ContribuyenteService from './contribuyente-service';
import CuentaService from './cuenta-service';
import DireccionService from './direccion-service';
import InformacionAdicionalService from './informacion-adicional-service';
import RelacionCuentaService from './relacion-cuenta-service';
import ArchivoService from './archivo-service';
import ObservacionService from './observacion-service';
import EtiquetaService from './etiqueta-service';
import VariableService from './variable-service';
import VariableCuentaService from './variable-cuenta-service';
import VinculoComercioService from './vinculo-comercio-service';
import InspeccionService from './inspeccion-service';
import ZonaEntregaService from './zona-entrega-service';
import ControladorCuentaService from './controlador-cuenta-service';
import CondicionEspecialService from './condicion-especial-service';
import RecargoDescuentoService from './recargo-descuento-service';
import DebitoAutomaticoService from './debito-automatico-service';
import RubroComercioService from './rubro-comercio-service';
import ElementoService from './elemento-service';

import { isValidString, isValidInteger, isValidBoolean } from '../../infraestructure/sdk/utils/validator';
import { getDateNow } from '../../infraestructure/sdk/utils/convert';
import { distinctArray } from '../../infraestructure/sdk/utils/helper';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import PersonaMin from '../dto/persona-min';

export default class ComercioService {

    comercioRepository: IComercioRepository;
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
    vinculoComercioService: VinculoComercioService;
    inspeccionService: InspeccionService;
    zonaEntregaService: ZonaEntregaService;
    controladorCuentaService: ControladorCuentaService;
    condicionEspecialService: CondicionEspecialService;
    recargoDescuentoService: RecargoDescuentoService;
    debitoAutomaticoService: DebitoAutomaticoService;
    rubroComercioService: RubroComercioService;
    elementoService: ElementoService;

    constructor(comercioRepository: IComercioRepository, contribuyenteService: ContribuyenteService, cuentaService: CuentaService, relacionCuentaService: RelacionCuentaService,
                direccionService: DireccionService, informacionAdicionalService: InformacionAdicionalService,
                archivoService: ArchivoService, observacionService: ObservacionService, etiquetaService: EtiquetaService,
                variableService: VariableService, variableCuentaService: VariableCuentaService, vinculoComercioService: VinculoComercioService,
                inspeccionService: InspeccionService, zonaEntregaService: ZonaEntregaService,  controladorCuentaService: ControladorCuentaService, condicionEspecialService: CondicionEspecialService,
                recargoDescuentoService: RecargoDescuentoService, debitoAutomaticoService: DebitoAutomaticoService,
                rubroComercioService: RubroComercioService, elementoService: ElementoService
    ) {
        this.comercioRepository = comercioRepository;
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
        this.vinculoComercioService = vinculoComercioService;
        this.inspeccionService = inspeccionService;
        this.zonaEntregaService = zonaEntregaService;
        this.controladorCuentaService = controladorCuentaService;
        this.condicionEspecialService = condicionEspecialService;
        this.recargoDescuentoService = recargoDescuentoService;
        this.debitoAutomaticoService = debitoAutomaticoService;
        this.rubroComercioService = rubroComercioService;
        this.elementoService = elementoService;
    }

    async listByCuenta(comercioFilter: ComercioFilter) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = (await this.comercioRepository.listByCuenta(comercioFilter) as Array<ComercioRow>).sort((a, b) => a.id - b.id);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }


    async listByDatos(comercioFilter: ComercioFilter) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = (await this.comercioRepository.listByDatos(comercioFilter) as Array<ComercioRow>).sort((a, b) => a.id - b.id);
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
                let comercioDTO = new ComercioDTO();            
                comercioDTO.comercio = await this.comercioRepository.findById(id) as Comercio;
                if (!comercioDTO.comercio) {
                    reject(new ReferenceError('No existe el registro'));
                    return;
                }
                let idCuenta = comercioDTO.comercio.idCuenta;

                comercioDTO.cuenta = await this.cuentaService.findById(comercioDTO.comercio.idCuenta) as Cuenta;
                comercioDTO.relacionesCuentas = await this.relacionCuentaService.listByCuenta(idCuenta) as Array<RelacionCuentaState>;
                comercioDTO.archivos = await this.archivoService.listByComercio(id) as Array<ArchivoState>;
                comercioDTO.observaciones = await this.observacionService.listByComercio(id) as Array<ObservacionState>;
                comercioDTO.etiquetas = await this.etiquetaService.listByComercio(id) as Array<EtiquetaState>;
                comercioDTO.variablesCuenta = await this.variableCuentaService.listByCuenta(idCuenta) as Array<VariableCuentaState>;
                comercioDTO.vinculosComercio = await this.vinculoComercioService.listByComercio(id) as Array<VinculoComercioState>;
                comercioDTO.inspecciones = await this.inspeccionService.listByComercio(id) as Array<InspeccionState>;
                comercioDTO.zonasEntrega = await this.zonaEntregaService.listByCuenta(idCuenta) as Array<ZonaEntregaState>;
                comercioDTO.controladoresCuentas = await this.controladorCuentaService.listByCuenta(idCuenta) as Array<ControladorCuentaState>;
                comercioDTO.condicionesEspeciales = await this.condicionEspecialService.listByCuenta(idCuenta) as Array<CondicionEspecialState>;
                comercioDTO.recargosDescuentos = await this.recargoDescuentoService.listByCuenta(idCuenta) as Array<RecargoDescuentoState>;
                comercioDTO.debitosAutomaticos = await this.debitoAutomaticoService.listByCuenta(idCuenta) as Array<DebitoAutomaticoState>;
                comercioDTO.rubrosComercio = await this.rubroComercioService.listByComercio(id) as Array<RubroComercioState>;
                comercioDTO.elementos = await this.elementoService.listByCuenta(idCuenta) as Array<ElementoState>;
                resolve(comercioDTO);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async add(comercioDTO: ComercioDTO) {
        const resultTransaction = this.comercioRepository.onTransaction( async () => {
            return new Promise( async (resolve, reject) => {
                try {
                    if (!isValidInteger(comercioDTO.comercio.idEstadoCarga, true)
                    ) {
                        reject(new ValidationError('Existen campos incompletos'));
                        return;
                    }
                    
                    comercioDTO.comercio.idCuenta = null;
                    comercioDTO.comercio.idEstadoCarga = 20; //Incompleta
                    comercioDTO.comercio.fechaCargaInicio = getDateNow();
                    comercioDTO.comercio.fechaCargaFin = null;
                    comercioDTO.comercio.idCuentaInmueble = null;
                    comercioDTO.comercio = await this.comercioRepository.add(comercioDTO.comercio) as Comercio;

                    comercioDTO.cuenta.idTipoTributo = 11; //11: Comercio
                    comercioDTO.cuenta.idTributo = comercioDTO.comercio.id;
                    comercioDTO.cuenta.idEstadoCuenta = 1; //Pendiente
                    comercioDTO.cuenta = await this.cuentaService.add(comercioDTO.cuenta) as Cuenta;

                    comercioDTO.comercio.idCuenta = comercioDTO.cuenta.id;
                    await this.comercioRepository.modify(comercioDTO.comercio.id, comercioDTO.comercio);

                    resolve(comercioDTO);
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

    async modify(id: number, idUsuario: number, comercioDTO: ComercioDTO) {
        const resultTransaction = this.comercioRepository.onTransaction( async () => {
            return new Promise( async (resolve, reject) => {
                try {
                    if (!isValidInteger(comercioDTO.comercio.idCuenta, true) ||
                    !isValidInteger(comercioDTO.comercio.idRubro, true) ||
                    !isValidString(comercioDTO.comercio.nombreFantasia, true) ||
                    !isValidString(comercioDTO.comercio.digitoVerificador, true) ||
                    !isValidBoolean(comercioDTO.comercio.granContribuyente)
                    ) {
                        reject(new ValidationError('Existen campos incompletos'));
                        return;
                    }

                    //los contribuyentes surgen entre responsables de cuenta y titulares (debe haber al menos un contribuyente)
                    let vinculosContribuyente = comercioDTO.vinculosComercio.filter(f => [60,61].includes(f.idTipoVinculoComercio) && f.state !== 'r');
                    vinculosContribuyente.sort((a,b) =>a.idTipoVinculoComercio - b.idTipoVinculoComercio);
                    if (vinculosContribuyente.length === 0) {
                        reject(new ValidationError('Debe vincular al menos un titular o responsable de cuenta'));
                        return;
                    }

                    // Si existen datos de rubros se tiene que verificar que solo un registro sea marcado como rubro principal
                    // No se debe permitir que haya registros y que ninguno sea marcado como principal
                    const rubrosComercioPrincipales = comercioDTO.rubrosComercio.filter(f => f.esRubroPrincipal && f.state !== 'r');
                    const rubrosComercioNoPrincipales = comercioDTO.rubrosComercio.filter(f => !f.esRubroPrincipal && f.state !== 'r');
                                 
                    if (comercioDTO.rubrosComercio.length > 0 && 
                        (rubrosComercioPrincipales.length > 1 || (rubrosComercioNoPrincipales.length > 0 && rubrosComercioPrincipales.length == 0))) {
                        reject(new ValidationError('Debe marcar un único rubro principal'));
                        return;
                    }

                    //si hubo algun cambio, entonces valido la consistencia de los rangos de fechas de las variables
                    if (comercioDTO.variablesCuenta.filter(f => f.state !== 'o').length > 0) {
                        if (!this.variableCuentaService.validateDateRange(comercioDTO.variablesCuenta)) {
                            reject(new ValidationError(`Existen rangos de fechas de variables que se superponen`));
                            return;
                        }
                    }

                    let idCuenta = comercioDTO.comercio.idCuenta;

                    //EstadoCarga => 20: Incompleta y 21:Completa
                    //EstadoCuenta => 1: Pendiente y 2:Activa
                    comercioDTO.comercio.fechaCargaFin = (comercioDTO.comercio.idEstadoCarga == 21) ? getDateNow() : null;
                    if (comercioDTO.comercio.idCuentaInmueble === 0) comercioDTO.comercio.idCuentaInmueble = null;
                    comercioDTO.comercio = await this.comercioRepository.modify(id, comercioDTO.comercio) as Comercio;
                    
                    comercioDTO.cuenta.idEstadoCuenta = (comercioDTO.comercio.idEstadoCarga == 20) ? 1 : 2;
                    comercioDTO.cuenta = await this.cuentaService.modify(idCuenta, comercioDTO.cuenta) as Cuenta;

                    let logAddAsyncPrimario = [];
                    let logAddAsyncSecundario = [];
                    let requestAdd = [];
                    let requestOther = [];

                    //verifico si tengo que hacer cambios (ya que comercioDTO.vinculosComercio incluye registros originales)
                    const contribuyentesUpdates = comercioDTO.vinculosComercio.filter(f => f.state !== 'o').length;
                    if (contribuyentesUpdates > 0) {
                        const personasContribuyenteIDs = distinctArray(vinculosContribuyente.map(x => x.idPersona));
                        const personasVinculo: Array<PersonaMin> = comercioDTO.vinculosComercio.map(vinculo => {
                            const persona = new PersonaMin();
                            persona.setFromObject({...vinculo});
                            return persona;
                        }) as Array<PersonaMin>;
                        await this.cuentaService.updateContribuyentes(idCuenta, personasVinculo, personasContribuyenteIDs);
                    }

                    //como viajan todos, tengo que filtrar ahora
                    comercioDTO.vinculosComercio.filter(f => f.state !== 'o').forEach(async row => {
                        if (row.state === 'a') {
                            logAddAsyncPrimario.push({entity: 'VinculoComercio', idSource: row.id});
                            requestAdd.push(this.vinculoComercioService.add(row as VinculoComercio));
                        }
                        else if (row.state === 'm') {
                            requestOther.push(this.vinculoComercioService.modify(row.id, row as VinculoComercio));
                        }
                        else if (row.state === 'r') {
                            requestOther.push(this.vinculoComercioService.remove(row.id));
                        }
                    });
                    //como viajan todos, tengo que filtrar ahora
                    comercioDTO.variablesCuenta.forEach(async row => {
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

                    comercioDTO.relacionesCuentas.forEach(async row => {
                        if (row.state === 'a') {
                            logAddAsyncPrimario.push({entity: 'RelacionCuenta', idSource: row.id});
                            requestAdd.push(this.relacionCuentaService.add(row as RelacionCuenta));
                        }
                        else if (row.state === 'r') {
                            requestOther.push(this.relacionCuentaService.remove(row.id));
                        }
                    });


                    comercioDTO.zonasEntrega.forEach(async row => {
                        if (row.state === 'a') {
                            logAddAsyncPrimario.push({entity: 'ZonaEntrega', idSource: row.id});
                            requestAdd.push(new Promise(async (resolve2, reject2) => {
                                try {
                                    //alta de la zona de entrega
                                    // const zonaEntrega = await this.zonaEntregaService.add(row as ZonaEntrega) as ZonaEntrega;

                                    // let requestAdd2 = [];
                                    // const offset_logAddAsyncSecundario = logAddAsyncSecundario.length;
                                    // //alta de la direccion
                                    // row.direccion.idEntidad = zonaEntrega.id;
                                    // logAddAsyncSecundario.push({entity: 'Direccion', idSource: row.direccion.id});
                                    // requestAdd2.push(this.direccionService.add(row.direccion as Direccion));

                                    // Promise.all(requestAdd2)
                                    // .then(responses2 => {
                                    //     //actualizo las id definitivas (para las altas)
                                    //     for(let i=0; i<responses2.length; i++) {
                                    //         logAddAsyncSecundario[offset_logAddAsyncSecundario + i].idTarget = responses2[i].id;
                                    //     }
                                    //     resolve2(zonaEntrega);
                                    // })
                                    // .catch(reject2);

                                    const zonaEntrega = await this.zonaEntregaService.add(row as ZonaEntrega) as ZonaEntrega;
                                    row.direccion.idEntidad = zonaEntrega.id;
                                    await this.direccionService.add(row.direccion as Direccion, row.email.length > 0);
                                    resolve2(zonaEntrega);
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

                    comercioDTO.controladoresCuentas.forEach(async row => {
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

                    comercioDTO.condicionesEspeciales.forEach(async row => {
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

                    comercioDTO.recargosDescuentos.forEach(async row => {
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

                    comercioDTO.debitosAutomaticos.forEach(async row => {
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


                    //como viajan todos, tengo que filtrar ahora
                    comercioDTO.rubrosComercio.filter(f => f.state !== 'o').forEach(async row => {
                        if (row.state === 'a') {
                            logAddAsyncPrimario.push({entity: 'RubroComercio', idSource: row.id});
                            requestAdd.push(new Promise(async (resolve2, reject2) => {
                                try {
                                    //alta de rubro comercio
                                    const rubroComercio = await this.rubroComercioService.add(row as RubroComercio) as RubroComercio;
                                    resolve2(rubroComercio);
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
                            //modificacion de rubro comercio
                            requestOther.push(this.rubroComercioService.modify(row.id, row as RubroComercio));
                        }
                        else if (row.state === 'r') {
                            requestOther.push(this.rubroComercioService.remove(row.id));   
                        }
                    });

                    comercioDTO.inspecciones.forEach(async row => {
                        if (row.state === 'a') {
                            logAddAsyncPrimario.push({entity: 'Inspeccion', idSource: row.id});
                            requestAdd.push(this.inspeccionService.add(row as Inspeccion));
                        }
                        else if (row.state === 'm') {
                            requestOther.push(this.inspeccionService.modify(row.id, row as Inspeccion));
                        }
                        else if (row.state === 'r') {
                            requestOther.push(this.inspeccionService.remove(row.id));
                        }
                    });

                    comercioDTO.elementos.forEach(async row => {
                        if (row.state === 'a') {
                            logAddAsyncPrimario.push({entity: 'Elemento', idSource: row.id});
                            requestAdd.push(this.elementoService.add(row as Elemento));
                        }
                        else if (row.state === 'm') {
                            requestOther.push(this.elementoService.modify(row.id, row as Elemento));
                        }
                        else if (row.state === 'r') {
                            requestOther.push(this.elementoService.remove(row.id));
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
                            if (comercioDTO.zonasEntrega.length > 0) {
                                await this.cuentaService.updateDireccionEntrega(idCuenta);
                            }

                            //unifico los logs
                            const logAdd = logAddAsyncPrimario.concat(logAddAsyncSecundario);
                            //proceso los archivos, observaciones y etiquetas
                            let informacionAdicionalDTO = new InformacionAdicionalDTO(comercioDTO.archivos, comercioDTO.observaciones, comercioDTO.etiquetas);
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
        const resultTransaction = this.comercioRepository.onTransaction( async () => {
            return new Promise( async (resolve, reject) => {
                try {
                    let comercioDTO = new ComercioDTO();            
                    comercioDTO.comercio = await this.comercioRepository.findById(id) as Comercio;
                    if (!comercioDTO.comercio) {
                        reject(new ReferenceError('No existe el registro'));
                        return;
                    }
                    let idCuenta = comercioDTO.comercio.idCuenta;

                    await this.cuentaService.unbindAllContribuyentes(idCuenta);
                    await this.variableCuentaService.removeByCuenta(idCuenta);
                    await this.vinculoComercioService.removeByComercio(id);
                    await this.relacionCuentaService.removeByCuenta(idCuenta);
                    await this.zonaEntregaService.removeByCuenta(idCuenta);
                    await this.controladorCuentaService.removeByCuenta(idCuenta);
                    await this.condicionEspecialService.removeByCuenta(idCuenta);
                    await this.recargoDescuentoService.removeByCuenta(idCuenta);
                    await this.debitoAutomaticoService.removeByCuenta(idCuenta);
                    await this.inspeccionService.removeByComercio(id);
                    await this.rubroComercioService.removeByComercio(id);

                    const comercio = await this.comercioRepository.findById(id);
                    if (!comercio) {
                        reject(new ReferenceError('No existe el registro'));
                        return;
                    }
                    const result = await this.comercioRepository.remove(id);
                    if (!result) {
                        reject(new ReferenceError('No existe el registro'));
                        return;
                    }
                    await this.cuentaService.remove(comercio.idCuenta);
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
