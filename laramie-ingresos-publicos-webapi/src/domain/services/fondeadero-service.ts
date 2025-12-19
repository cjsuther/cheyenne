import Fondeadero from '../entities/fondeadero';
import Cuenta from '../entities/cuenta';
import RelacionCuenta from '../entities/relacion-cuenta';
import Direccion from '../entities/direccion';
import VariableCuenta from '../entities/variable-cuenta';
import VinculoFondeadero from '../entities/vinculo-fondeadero';
import ZonaEntrega from '../entities/zona-entrega';
import ControladorCuenta from '../entities/controlador-cuenta';
import CondicionEspecial from '../entities/condicion-especial';
import RecargoDescuento from '../entities/recargo-descuento';
import DebitoAutomatico from '../entities/debito-automatico';
import DeclaracionJurada from '../entities/declaracion-jurada';

import FondeaderoRow from '../dto/fondeadero-row';
import FondeaderoFilter from '../dto/fondeadero-filter';
import FondeaderoDTO from '../dto/fondeadero-dto';
import RelacionCuentaState from '../dto/relacion-cuenta-state';
import InformacionAdicionalDTO from '../dto/informacion-adicional-dto';
import RelacionCuentaService from './relacion-cuenta-service';
import ArchivoState from '../dto/archivo-state';
import ObservacionState from '../dto/observacion-state';
import EtiquetaState from '../dto/etiqueta-state';
import VariableCuentaState from '../dto/variable-cuenta-state';
import VinculoFondeaderoState from '../dto/vinculo-fondeadero-state';
import ZonaEntregaState from '../dto/zona-entrega-state';
import ControladorCuentaState from '../dto/controlador-cuenta-state';
import CondicionEspecialState from '../dto/condicion-especial-state';
import RecargoDescuentoState from '../dto/recargo-descuento-state';
import DebitoAutomaticoState from '../dto/debito-automatico-state';
import DeclaracionJuradaState from '../dto/declaracion-jurada-state';

import IFondeaderoRepository from '../repositories/fondeadero-repository';
import ContribuyenteService from './contribuyente-service';
import CuentaService from './cuenta-service';
import DireccionService from './direccion-service';
import InformacionAdicionalService from './informacion-adicional-service';
import ArchivoService from './archivo-service';
import ObservacionService from './observacion-service';
import EtiquetaService from './etiqueta-service';
import VariableService from './variable-service';
import VariableCuentaService from './variable-cuenta-service';
import VinculoFondeaderoService from './vinculo-fondeadero-service';
import ZonaEntregaService from './zona-entrega-service';
import ControladorCuentaService from './controlador-cuenta-service';
import CondicionEspecialService from './condicion-especial-service';
import RecargoDescuentoService from './recargo-descuento-service';
import DebitoAutomaticoService from './debito-automatico-service';
import DeclaracionJuradaService from './declaracion-jurada-service';

import { isValidInteger, isValidString, isValidDate } from '../../infraestructure/sdk/utils/validator';
import { getDateNow } from '../../infraestructure/sdk/utils/convert';
import { distinctArray } from '../../infraestructure/sdk/utils/helper';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import PersonaMin from '../dto/persona-min';


export default class FondeaderoService {

    fondeaderoRepository: IFondeaderoRepository;
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
    vinculoFondeaderoService: VinculoFondeaderoService;
    zonaEntregaService: ZonaEntregaService;
    controladorCuentaService: ControladorCuentaService;
    condicionEspecialService: CondicionEspecialService;
    recargoDescuentoService: RecargoDescuentoService;
    debitoAutomaticoService: DebitoAutomaticoService;
    declaracionJuradaService: DeclaracionJuradaService;

    constructor(fondeaderoRepository: IFondeaderoRepository, contribuyenteService: ContribuyenteService, cuentaService: CuentaService, relacionCuentaService: RelacionCuentaService,
                direccionService: DireccionService, informacionAdicionalService: InformacionAdicionalService,
                archivoService: ArchivoService, observacionService: ObservacionService, etiquetaService: EtiquetaService,
                variableService: VariableService, variableCuentaService: VariableCuentaService, vinculoFondeaderoService: VinculoFondeaderoService,
                zonaEntregaService: ZonaEntregaService, controladorCuentaService: ControladorCuentaService, condicionEspecialService: CondicionEspecialService,
                recargoDescuentoService: RecargoDescuentoService, debitoAutomaticoService: DebitoAutomaticoService,
                declaracionJuradaService: DeclaracionJuradaService
    ) {
        this.fondeaderoRepository = fondeaderoRepository;
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
        this.vinculoFondeaderoService = vinculoFondeaderoService;
        this.zonaEntregaService = zonaEntregaService;
        this.controladorCuentaService = controladorCuentaService;
        this.condicionEspecialService = condicionEspecialService;
        this.recargoDescuentoService = recargoDescuentoService;
        this.debitoAutomaticoService = debitoAutomaticoService;
        this.declaracionJuradaService = declaracionJuradaService;
    }

    async listByCuenta(fondeaderoFilter: FondeaderoFilter) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = (await this.fondeaderoRepository.listByCuenta(fondeaderoFilter) as Array<FondeaderoRow>).sort((a, b) => a.id - b.id);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async listByDatos(fondeaderoFilter: FondeaderoFilter) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = (await this.fondeaderoRepository.listByDatos(fondeaderoFilter) as Array<FondeaderoRow>).sort((a, b) => a.id - b.id);
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
                let fondeaderoDTO = new FondeaderoDTO();            
                fondeaderoDTO.fondeadero = await this.fondeaderoRepository.findById(id) as Fondeadero;
                if (!fondeaderoDTO.fondeadero) {
                    reject(new ReferenceError('No existe el registro'));
                    return;
                }
                let idCuenta = fondeaderoDTO.fondeadero.idCuenta;

                fondeaderoDTO.cuenta = await this.cuentaService.findById(fondeaderoDTO.fondeadero.idCuenta) as Cuenta;
                fondeaderoDTO.relacionesCuentas = await this.relacionCuentaService.listByCuenta(idCuenta) as Array<RelacionCuentaState>;
                fondeaderoDTO.archivos = await this.archivoService.listByFondeadero(id) as Array<ArchivoState>;
                fondeaderoDTO.observaciones = await this.observacionService.listByFondeadero(id) as Array<ObservacionState>;
                fondeaderoDTO.etiquetas = await this.etiquetaService.listByFondeadero(id) as Array<EtiquetaState>;
                fondeaderoDTO.variablesCuenta = await this.variableCuentaService.listByCuenta(idCuenta) as Array<VariableCuentaState>;
                fondeaderoDTO.vinculosFondeadero = await this.vinculoFondeaderoService.listByFondeadero(id) as Array<VinculoFondeaderoState>;
                fondeaderoDTO.zonasEntrega = await this.zonaEntregaService.listByCuenta(idCuenta) as Array<ZonaEntregaState>;
                fondeaderoDTO.controladoresCuentas = await this.controladorCuentaService.listByCuenta(idCuenta) as Array<ControladorCuentaState>;
                fondeaderoDTO.condicionesEspeciales = await this.condicionEspecialService.listByCuenta(idCuenta) as Array<CondicionEspecialState>;
                fondeaderoDTO.recargosDescuentos = await this.recargoDescuentoService.listByCuenta(idCuenta) as Array<RecargoDescuentoState>;
                fondeaderoDTO.debitosAutomaticos = await this.debitoAutomaticoService.listByCuenta(idCuenta) as Array<DebitoAutomaticoState>;
                fondeaderoDTO.declaracionesJuradas = await this.declaracionJuradaService.listByCuenta(idCuenta) as Array<DeclaracionJuradaState>;

                resolve(fondeaderoDTO);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async add(fondeaderoDTO: FondeaderoDTO) {
        const resultTransaction = this.fondeaderoRepository.onTransaction( async () => {
            return new Promise( async (resolve, reject) => {
                try {
                    if (!isValidInteger(fondeaderoDTO.fondeadero.idEstadoCarga, true) ||
                        !isValidInteger(fondeaderoDTO.fondeadero.idTasa, true) ||
                        !isValidInteger(fondeaderoDTO.fondeadero.idSubTasa, true) ||
                        !isValidString(fondeaderoDTO.fondeadero.embarcacion, true) ||
                        !isValidString(fondeaderoDTO.fondeadero.superficie, true) ||
                        !isValidString(fondeaderoDTO.fondeadero.longitud, true) ||
                        !isValidString(fondeaderoDTO.fondeadero.codigo, true) ||
                        !isValidString(fondeaderoDTO.fondeadero.club, true) ||
                        !isValidString(fondeaderoDTO.fondeadero.digitoVerificador, true) ||
                        !isValidString(fondeaderoDTO.fondeadero.ubicacion, true) ||
                        !isValidString(fondeaderoDTO.fondeadero.margen, true) ||
                        !isValidDate(fondeaderoDTO.fondeadero.fechaAlta, true)
                    ) {
                        reject(new ValidationError('Existen campos incompletos'));
                        return;
                    }
                    
                    fondeaderoDTO.fondeadero.idCuenta = null;
                    fondeaderoDTO.fondeadero.idEstadoCarga = 20; //Incompleta
                    fondeaderoDTO.fondeadero.fechaCargaInicio = getDateNow();
                    fondeaderoDTO.fondeadero.fechaCargaFin = null;
                    fondeaderoDTO.fondeadero = await this.fondeaderoRepository.add(fondeaderoDTO.fondeadero) as Fondeadero;

                    fondeaderoDTO.cuenta.idTipoTributo = 14; //14: Fondeadero
                    fondeaderoDTO.cuenta.idTributo = fondeaderoDTO.fondeadero.id;
                    fondeaderoDTO.cuenta.idEstadoCuenta = 1; //Pendiente
                    fondeaderoDTO.cuenta = await this.cuentaService.add(fondeaderoDTO.cuenta) as Cuenta;

                    fondeaderoDTO.fondeadero.idCuenta = fondeaderoDTO.cuenta.id;
                    await this.fondeaderoRepository.modify(fondeaderoDTO.fondeadero.id, fondeaderoDTO.fondeadero);

                    resolve(fondeaderoDTO);
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

    async modify(id: number, idUsuario: number, fondeaderoDTO: FondeaderoDTO) {
        const resultTransaction = this.fondeaderoRepository.onTransaction( async () => {
            return new Promise( async (resolve, reject) => {
                try {
                    if (!isValidInteger(fondeaderoDTO.fondeadero.idCuenta, true) ||
                        !isValidInteger(fondeaderoDTO.fondeadero.idTasa, true) ||
                        !isValidInteger(fondeaderoDTO.fondeadero.idSubTasa, true) ||
                        !isValidString(fondeaderoDTO.fondeadero.embarcacion, true) ||
                        !isValidString(fondeaderoDTO.fondeadero.superficie, true) ||
                        !isValidString(fondeaderoDTO.fondeadero.longitud, true) ||
                        !isValidString(fondeaderoDTO.fondeadero.codigo, true) ||
                        !isValidString(fondeaderoDTO.fondeadero.club, true) ||
                        !isValidString(fondeaderoDTO.fondeadero.digitoVerificador, true) ||
                        !isValidString(fondeaderoDTO.fondeadero.ubicacion, true) ||
                        !isValidString(fondeaderoDTO.fondeadero.margen, true) ||
                        !isValidDate(fondeaderoDTO.fondeadero.fechaAlta, true)
                    ) {
                        reject(new ValidationError('Existen campos incompletos'));
                        return;
                    }

                    //los contribuyentes surgen entre responsables de cuenta y titulares (debe haber al menos un contribuyente)
                    let vinculosContribuyente = fondeaderoDTO.vinculosFondeadero.filter(f => [90,91].includes(f.idTipoVinculoFondeadero) && f.state !== 'r');
                    vinculosContribuyente.sort((a,b) =>a.idTipoVinculoFondeadero - b.idTipoVinculoFondeadero);
                    if (vinculosContribuyente.length === 0) {
                        reject(new ValidationError('Debe vincular al menos un titular o responsable de cuenta'));
                        return;
                    }
                    let idCuenta = fondeaderoDTO.fondeadero.idCuenta;

                    //si hubo algun cambio, entonces valido la consistencia de los rangos de fechas de las variables
                    if (fondeaderoDTO.variablesCuenta.filter(f => f.state !== 'o').length > 0) {
                        if (!this.variableCuentaService.validateDateRange(fondeaderoDTO.variablesCuenta)) {
                            reject(new ValidationError(`Existen rangos de fechas de variables que se superponen`));
                            return;
                        }
                    }

                    //EstadoCarga => 20: Incompleta y 21:Completa
                    //EstadoCuenta => 1: Pendiente y 2:Activa
                    fondeaderoDTO.fondeadero.fechaCargaFin = (fondeaderoDTO.fondeadero.idEstadoCarga == 21) ? getDateNow() : null;
                    fondeaderoDTO.fondeadero = await this.fondeaderoRepository.modify(id, fondeaderoDTO.fondeadero) as Fondeadero;
                    
                    fondeaderoDTO.cuenta.idEstadoCuenta = (fondeaderoDTO.fondeadero.idEstadoCarga == 20) ? 1 : 2;
                    fondeaderoDTO.cuenta = await this.cuentaService.modify(idCuenta, fondeaderoDTO.cuenta) as Cuenta;

                    let logAddAsyncPrimario = [];
                    let logAddAsyncSecundario = [];
                    let requestAdd = [];
                    let requestOther = [];

                    //verifico si tengo que hacer cambios (ya que fondeaderoDTO.vinculosFondeadero incluye registros originales)
                    const contribuyentesUpdates = fondeaderoDTO.vinculosFondeadero.filter(f => f.state !== 'o').length;
                    if (contribuyentesUpdates > 0) {
                        const personasContribuyenteIDs = distinctArray(vinculosContribuyente.map(x => x.idPersona));
                        const personasVinculo: Array<PersonaMin> = fondeaderoDTO.vinculosFondeadero.map(vinculo => {
                            const persona = new PersonaMin();
                            persona.setFromObject({...vinculo});
                            return persona;
                        }) as Array<PersonaMin>;
                        await this.cuentaService.updateContribuyentes(idCuenta, personasVinculo, personasContribuyenteIDs);
                    }

                    //como viajan todos, tengo que filtrar ahora
                    fondeaderoDTO.vinculosFondeadero.filter(f => f.state !== 'o').forEach(async row => {
                        if (row.state === 'a') {
                            logAddAsyncPrimario.push({entity: 'VinculoFondeadero', idSource: row.id});
                            requestAdd.push(this.vinculoFondeaderoService.add(row as VinculoFondeadero));
                        }
                        else if (row.state === 'm') {
                            requestOther.push(this.vinculoFondeaderoService.modify(row.id, row as VinculoFondeadero));
                        }
                        else if (row.state === 'r') {
                            requestOther.push(this.vinculoFondeaderoService.remove(row.id));
                        }
                    });
                    //como viajan todos, tengo que filtrar ahora
                    fondeaderoDTO.variablesCuenta.forEach(async row => {
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

                    fondeaderoDTO.relacionesCuentas.forEach(async row => {
                        if (row.state === 'a') {
                            logAddAsyncPrimario.push({entity: 'RelacionCuenta', idSource: row.id});
                            requestAdd.push(this.relacionCuentaService.add(row as RelacionCuenta));
                        }
                        else if (row.state === 'r') {
                            requestOther.push(this.relacionCuentaService.remove(row.id));
                        }
                    });


                    fondeaderoDTO.zonasEntrega.forEach(async row => {
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

                    fondeaderoDTO.controladoresCuentas.forEach(async row => {
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

                    fondeaderoDTO.condicionesEspeciales.forEach(async row => {
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

                    fondeaderoDTO.recargosDescuentos.forEach(async row => {
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

                    fondeaderoDTO.debitosAutomaticos.forEach(async row => {
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

                    fondeaderoDTO.declaracionesJuradas.forEach(async row => {
                        if (row.state === 'a') {
                            logAddAsyncPrimario.push({entity: 'DeclaracionJurada', idSource: row.id});
                            requestAdd.push(this.declaracionJuradaService.add(row as DeclaracionJurada));
                        }
                        else if (row.state === 'm') {
                            requestOther.push(this.declaracionJuradaService.modify(row.id, row as DeclaracionJurada));
                        }
                        else if (row.state === 'r') {
                            requestOther.push(this.declaracionJuradaService.remove(row.id));
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
                            if (fondeaderoDTO.zonasEntrega.length > 0) {
                                await this.cuentaService.updateDireccionEntrega(idCuenta);
                            }

                            //unifico los logs
                            const logAdd = logAddAsyncPrimario.concat(logAddAsyncSecundario);
                            //proceso los archivos, observaciones y etiquetas
                            let informacionAdicionalDTO = new InformacionAdicionalDTO(fondeaderoDTO.archivos, fondeaderoDTO.observaciones, fondeaderoDTO.etiquetas);
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
        const resultTransaction = this.fondeaderoRepository.onTransaction( async () => {
            return new Promise( async (resolve, reject) => {
                try {
                    let fondeaderoDTO = new FondeaderoDTO();            
                    fondeaderoDTO.fondeadero = await this.fondeaderoRepository.findById(id) as Fondeadero;
                    if (!fondeaderoDTO.fondeadero) {
                        reject(new ReferenceError('No existe el registro'));
                        return;
                    }
                    let idCuenta = fondeaderoDTO.fondeadero.idCuenta;

                    await this.cuentaService.unbindAllContribuyentes(idCuenta);
                    await this.variableCuentaService.removeByCuenta(idCuenta);
                    await this.vinculoFondeaderoService.removeByFondeadero(id);
                    await this.relacionCuentaService.removeByCuenta(idCuenta);
                    await this.zonaEntregaService.removeByCuenta(idCuenta);
                    await this.controladorCuentaService.removeByCuenta(idCuenta);
                    await this.condicionEspecialService.removeByCuenta(idCuenta);
                    await this.recargoDescuentoService.removeByCuenta(idCuenta);
                    await this.debitoAutomaticoService.removeByCuenta(idCuenta);

                    const fondeadero = await this.fondeaderoRepository.findById(id);
                    if (!fondeadero) {
                        reject(new ReferenceError('No existe el registro'));
                        return;
                    }
                    const result = await this.fondeaderoRepository.remove(id);
                    if (!result) {
                        reject(new ReferenceError('No existe el registro'));
                        return;
                    }
                    await this.cuentaService.remove(fondeadero.idCuenta);
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
