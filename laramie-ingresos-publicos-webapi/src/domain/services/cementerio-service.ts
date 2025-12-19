import Cementerio from '../entities/cementerio';
import Cuenta from '../entities/cuenta';
import RelacionCuenta from '../entities/relacion-cuenta';
import Direccion from '../entities/direccion';
import VariableCuenta from '../entities/variable-cuenta';
import VinculoCementerio from '../entities/vinculo-cementerio';
import ZonaEntrega from '../entities/zona-entrega';
import ControladorCuenta from '../entities/controlador-cuenta';
import CondicionEspecial from '../entities/condicion-especial';
import RecargoDescuento from '../entities/recargo-descuento';
import DebitoAutomatico from '../entities/debito-automatico';
import Inhumado from '../entities/inhumado';
import Verificacion from '../entities/verificacion';

import CementerioRow from '../dto/cementerio-row';
import CementerioFilter from '../dto/cementerio-filter';
import CementerioDTO from '../dto/cementerio-dto';
import RelacionCuentaState from '../dto/relacion-cuenta-state';
import InformacionAdicionalDTO from '../dto/informacion-adicional-dto';
import ArchivoState from '../dto/archivo-state';
import ObservacionState from '../dto/observacion-state';
import EtiquetaState from '../dto/etiqueta-state';
import VariableCuentaState from '../dto/variable-cuenta-state';
import VinculoCementerioState from '../dto/vinculo-cementerio-state';
import InhumadoState from '../dto/inhumado-state';
import ZonaEntregaState from '../dto/zona-entrega-state';
import ControladorCuentaState from '../dto/controlador-cuenta-state';
import CondicionEspecialState from '../dto/condicion-especial-state';
import RecargoDescuentoState from '../dto/recargo-descuento-state';
import DebitoAutomaticoState from '../dto/debito-automatico-state';

import ICementerioRepository from '../repositories/cementerio-repository';
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
import VinculoCementerioService from './vinculo-cementerio-service';
import InhumadoService from './inhumado-service';
import VerificacionService from './verificacion-service';
import ZonaEntregaService from './zona-entrega-service';
import ControladorCuentaService from './controlador-cuenta-service';
import CondicionEspecialService from './condicion-especial-service';
import RecargoDescuentoService from './recargo-descuento-service';
import DebitoAutomaticoService from './debito-automatico-service';

import { isValidString, isValidInteger, isValidDate, isValidFloat } from '../../infraestructure/sdk/utils/validator';
import { getDateNow } from '../../infraestructure/sdk/utils/convert';
import { distinctArray } from '../../infraestructure/sdk/utils/helper';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import PersonaMin from '../dto/persona-min';


export default class CementerioService {

    cementerioRepository: ICementerioRepository;
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
    vinculoCementerioService: VinculoCementerioService;
    inhumadoService: InhumadoService;
    verificacionService: VerificacionService;
    zonaEntregaService: ZonaEntregaService;
    controladorCuentaService: ControladorCuentaService;
    condicionEspecialService: CondicionEspecialService;
    recargoDescuentoService: RecargoDescuentoService;
    debitoAutomaticoService: DebitoAutomaticoService;

    constructor(cementerioRepository: ICementerioRepository, contribuyenteService: ContribuyenteService, cuentaService: CuentaService, relacionCuentaService: RelacionCuentaService,
                direccionService: DireccionService, informacionAdicionalService: InformacionAdicionalService,
                archivoService: ArchivoService, observacionService: ObservacionService, etiquetaService: EtiquetaService,
                variableService: VariableService, variableCuentaService: VariableCuentaService, vinculoCementerioService: VinculoCementerioService,
                inhumadoService: InhumadoService, verificacionService: VerificacionService,
                zonaEntregaService: ZonaEntregaService, controladorCuentaService: ControladorCuentaService, condicionEspecialService: CondicionEspecialService,
                recargoDescuentoService: RecargoDescuentoService, debitoAutomaticoService: DebitoAutomaticoService
                
    ) {
        this.cementerioRepository = cementerioRepository;
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
        this.vinculoCementerioService = vinculoCementerioService;
        this.inhumadoService = inhumadoService;
        this.verificacionService = verificacionService;
        this.zonaEntregaService = zonaEntregaService;
        this.controladorCuentaService = controladorCuentaService;
        this.condicionEspecialService = condicionEspecialService;
        this.recargoDescuentoService = recargoDescuentoService;
        this.debitoAutomaticoService = debitoAutomaticoService;
    }

    async listByCuenta(cementerioFilter: CementerioFilter) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = (await this.cementerioRepository.listByCuenta(cementerioFilter) as Array<CementerioRow>).sort((a, b) => a.id - b.id);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async listByDatos(cementerioFilter: CementerioFilter) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = (await this.cementerioRepository.listByDatos(cementerioFilter) as Array<CementerioRow>).sort((a, b) => a.id - b.id);
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
                let cementerioDTO = new CementerioDTO();            
                cementerioDTO.cementerio = await this.cementerioRepository.findById(id) as Cementerio;
                if (!cementerioDTO.cementerio) {
                    reject(new ReferenceError('No existe el registro'));
                    return;
                }
                let idCuenta = cementerioDTO.cementerio.idCuenta;

                cementerioDTO.cuenta = await this.cuentaService.findById(cementerioDTO.cementerio.idCuenta) as Cuenta;
                cementerioDTO.relacionesCuentas = await this.relacionCuentaService.listByCuenta(idCuenta) as Array<RelacionCuentaState>;
                cementerioDTO.archivos = await this.archivoService.listByCementerio(id) as Array<ArchivoState>;
                cementerioDTO.observaciones = await this.observacionService.listByCementerio(id) as Array<ObservacionState>;
                cementerioDTO.etiquetas = await this.etiquetaService.listByCementerio(id) as Array<EtiquetaState>;
                cementerioDTO.variablesCuenta = await this.variableCuentaService.listByCuenta(idCuenta) as Array<VariableCuentaState>;
                cementerioDTO.vinculosCementerio = await this.vinculoCementerioService.listByCementerio(id) as Array<VinculoCementerioState>;
                cementerioDTO.inhumados = await this.inhumadoService.listByCementerio(id) as Array<InhumadoState>;
                cementerioDTO.zonasEntrega = await this.zonaEntregaService.listByCuenta(idCuenta) as Array<ZonaEntregaState>;
                cementerioDTO.controladoresCuentas = await this.controladorCuentaService.listByCuenta(idCuenta) as Array<ControladorCuentaState>;
                cementerioDTO.condicionesEspeciales = await this.condicionEspecialService.listByCuenta(idCuenta) as Array<CondicionEspecialState>;
                cementerioDTO.recargosDescuentos = await this.recargoDescuentoService.listByCuenta(idCuenta) as Array<RecargoDescuentoState>;
                cementerioDTO.debitosAutomaticos = await this.debitoAutomaticoService.listByCuenta(idCuenta) as Array<DebitoAutomaticoState>;

                resolve(cementerioDTO);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async add(cementerioDTO: CementerioDTO) {
        const resultTransaction = this.cementerioRepository.onTransaction( async () => {
            return new Promise( async (resolve, reject) => {
                try {
                    if (!isValidInteger(cementerioDTO.cementerio.idEstadoCarga, true) ||
                        !isValidInteger(cementerioDTO.cementerio.idTipoConstruccionFuneraria, true) ||
                        !isValidInteger(cementerioDTO.cementerio.idCementerio, true) ||
                        !isValidString(cementerioDTO.cementerio.circunscripcionCementerio, true) ||
                        !isValidString(cementerioDTO.cementerio.seccionCementerio, true) ||
                        !isValidString(cementerioDTO.cementerio.manzanaCementerio, true) ||
                        !isValidString(cementerioDTO.cementerio.parcelaCementerio, true) ||
                        !isValidString(cementerioDTO.cementerio.frenteCementerio, true) ||
                        !isValidString(cementerioDTO.cementerio.filaCementerio, true) ||
                        !isValidString(cementerioDTO.cementerio.numeroCementerio, true) ||
                        !isValidDate(cementerioDTO.cementerio.fechaAlta, true) ||
                        !isValidDate(cementerioDTO.cementerio.fechaBaja, false) ||
                        !isValidDate(cementerioDTO.cementerio.fechaPresentacion, false) ||
                        !isValidString(cementerioDTO.cementerio.digitoVerificador, true) ||
                        !isValidDate(cementerioDTO.cementerio.fechaConcesion, false) ||
                        !isValidDate(cementerioDTO.cementerio.fechaEscritura, false) ||
                        !isValidDate(cementerioDTO.cementerio.fechaSucesion, false) ||
                        !isValidString(cementerioDTO.cementerio.libroEscritura, true) ||
                        !isValidString(cementerioDTO.cementerio.folioEscritura, true) ||
                        !isValidString(cementerioDTO.cementerio.numeroSucesion, true) ||
                        !isValidFloat(cementerioDTO.cementerio.superficie, true) ||
                        !isValidFloat(cementerioDTO.cementerio.largo, true) ||
                        !isValidFloat(cementerioDTO.cementerio.ancho, true)                    
                    ) {
                        reject(new ValidationError('Existen campos incompletos'));
                        return;
                    }
                    
                    cementerioDTO.cementerio.idCuenta = null;
                    cementerioDTO.cementerio.idEstadoCarga = 20; //Incompleta
                    cementerioDTO.cementerio.fechaCargaInicio = getDateNow();
                    cementerioDTO.cementerio.fechaCargaFin = null;
                    cementerioDTO.cementerio = await this.cementerioRepository.add(cementerioDTO.cementerio) as Cementerio;

                    cementerioDTO.cuenta.idTipoTributo = 13; //13: Cementerio
                    cementerioDTO.cuenta.idTributo = cementerioDTO.cementerio.id;
                    cementerioDTO.cuenta.idEstadoCuenta = 1; //Pendiente
                    cementerioDTO.cuenta = await this.cuentaService.add(cementerioDTO.cuenta) as Cuenta;

                    cementerioDTO.cementerio.idCuenta = cementerioDTO.cuenta.id;
                    await this.cementerioRepository.modify(cementerioDTO.cementerio.id, cementerioDTO.cementerio);

                    resolve(cementerioDTO);
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

    async modify(id: number, idUsuario: number, cementerioDTO: CementerioDTO) {
        const resultTransaction = this.cementerioRepository.onTransaction( async () => {
            return new Promise( async (resolve, reject) => {
                try {
                    if (!isValidInteger(cementerioDTO.cementerio.idCuenta, true) ||
                        !isValidInteger(cementerioDTO.cementerio.idTipoConstruccionFuneraria, true) ||
                        !isValidInteger(cementerioDTO.cementerio.idCementerio, true) ||
                        !isValidString(cementerioDTO.cementerio.circunscripcionCementerio, true) ||
                        !isValidString(cementerioDTO.cementerio.seccionCementerio, true) ||
                        !isValidString(cementerioDTO.cementerio.manzanaCementerio, true) ||
                        !isValidString(cementerioDTO.cementerio.parcelaCementerio, true) ||
                        !isValidString(cementerioDTO.cementerio.frenteCementerio, true) ||
                        !isValidString(cementerioDTO.cementerio.filaCementerio, true) ||
                        !isValidString(cementerioDTO.cementerio.numeroCementerio, true) ||
                        !isValidDate(cementerioDTO.cementerio.fechaAlta, true) ||
                        !isValidDate(cementerioDTO.cementerio.fechaBaja, false) ||
                        !isValidDate(cementerioDTO.cementerio.fechaPresentacion, false) ||
                        !isValidString(cementerioDTO.cementerio.digitoVerificador, true) ||
                        !isValidDate(cementerioDTO.cementerio.fechaConcesion, false) ||
                        !isValidDate(cementerioDTO.cementerio.fechaEscritura, false) ||
                        !isValidDate(cementerioDTO.cementerio.fechaSucesion, false) ||
                        !isValidString(cementerioDTO.cementerio.libroEscritura, true) ||
                        !isValidString(cementerioDTO.cementerio.folioEscritura, true) ||
                        !isValidString(cementerioDTO.cementerio.numeroSucesion, true) ||
                        !isValidFloat(cementerioDTO.cementerio.superficie, true) ||
                        !isValidFloat(cementerioDTO.cementerio.largo, true) ||
                        !isValidFloat(cementerioDTO.cementerio.ancho, true)                    
                    ) {
                        reject(new ValidationError('Existen campos incompletos'));
                        return;
                    }

                    //los contribuyentes surgen entre responsables de cuenta y titulares (debe haber al menos un contribuyente)
                    const vinculosContribuyente = cementerioDTO.vinculosCementerio.filter(f => [80,81].includes(f.idTipoVinculoCementerio) && f.state !== 'r');
                    vinculosContribuyente.sort((a,b) =>a.idTipoVinculoCementerio - b.idTipoVinculoCementerio);
                    if (vinculosContribuyente.length === 0) {
                        reject(new ValidationError('Debe vincular al menos un titular o responsable de cuenta'));
                        return;
                    }
                    let idCuenta = cementerioDTO.cementerio.idCuenta;

                    //si hubo algun cambio, entonces valido la consistencia de los rangos de fechas de las variables
                    if (cementerioDTO.variablesCuenta.filter(f => f.state !== 'o').length > 0) {
                        if (!this.variableCuentaService.validateDateRange(cementerioDTO.variablesCuenta)) {
                            reject(new ValidationError(`Existen rangos de fechas de variables que se superponen`));
                            return;
                        }
                    }

                    //EstadoCarga => 20: Incompleta y 21:Completa
                    //EstadoCuenta => 1: Pendiente y 2:Activa
                    cementerioDTO.cementerio.fechaCargaFin = (cementerioDTO.cementerio.idEstadoCarga == 21) ? getDateNow() : null;
                    cementerioDTO.cementerio = await this.cementerioRepository.modify(id, cementerioDTO.cementerio) as Cementerio;
                    
                    cementerioDTO.cuenta.idEstadoCuenta = (cementerioDTO.cementerio.idEstadoCarga == 20) ? 1 : 2;
                    cementerioDTO.cuenta = await this.cuentaService.modify(idCuenta, cementerioDTO.cuenta) as Cuenta;

                    let logAddAsyncPrimario = [];
                    let logAddAsyncSecundario = [];
                    let requestAdd = [];
                    let requestOther = [];

                    //verifico si tengo que hacer cambios (ya que cementerioDTO.vinculosCementerio incluye registros originales)
                    const contribuyentesUpdates = cementerioDTO.vinculosCementerio.filter(f => f.state !== 'o').length;
                    if (contribuyentesUpdates > 0) {
                        const personasContribuyenteIDs = distinctArray(vinculosContribuyente.map(x => x.idPersona));
                        const personasVinculo: Array<PersonaMin> = cementerioDTO.vinculosCementerio.map(vinculo => {
                            const persona = new PersonaMin();
                            persona.setFromObject({...vinculo});
                            return persona;
                        }) as Array<PersonaMin>;
                        await this.cuentaService.updateContribuyentes(idCuenta, personasVinculo, personasContribuyenteIDs);
                    }

                    //como viajan todos, tengo que filtrar ahora
                    cementerioDTO.vinculosCementerio.filter(f => f.state !== 'o').forEach(async row => {
                        if (row.state === 'a') {
                            logAddAsyncPrimario.push({entity: 'VinculoCementerio', idSource: row.id});
                            requestAdd.push(this.vinculoCementerioService.add(row as VinculoCementerio));
                        }
                        else if (row.state === 'm') {
                            requestOther.push(this.vinculoCementerioService.modify(row.id, row as VinculoCementerio));
                        }
                        else if (row.state === 'r') {
                            requestOther.push(this.vinculoCementerioService.remove(row.id));
                        }
                    });
                    //como viajan todos, tengo que filtrar ahora
                    cementerioDTO.variablesCuenta.forEach(async row => {
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

                    cementerioDTO.relacionesCuentas.forEach(async row => {
                        if (row.state === 'a') {
                            logAddAsyncPrimario.push({entity: 'RelacionCuenta', idSource: row.id});
                            requestAdd.push(this.relacionCuentaService.add(row as RelacionCuenta));
                        }
                        else if (row.state === 'r') {
                            requestOther.push(this.relacionCuentaService.remove(row.id));
                        }
                    });


                    cementerioDTO.zonasEntrega.forEach(async row => {
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

                    cementerioDTO.controladoresCuentas.forEach(async row => {
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

                    cementerioDTO.condicionesEspeciales.forEach(async row => {
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

                    cementerioDTO.recargosDescuentos.forEach(async row => {
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

                    cementerioDTO.debitosAutomaticos.forEach(async row => {
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
                    

                    cementerioDTO.inhumados.forEach(async row => {
                        if (row.state === 'a') {
                            logAddAsyncPrimario.push({entity: 'Inhumado', idSource: row.id});
                            requestAdd.push(new Promise(async (resolve2, reject2) => {
                                try {
                                    //alta de obra
                                    const inhumado = await this.inhumadoService.add(row as Inhumado) as Inhumado;

                                    const offset_logAddAsyncSecundario = logAddAsyncSecundario.length;
                                    let requestAdd2 = [];
                                    //alta de la direccion
                                    row.direccion.idEntidad = inhumado.id;
                                    logAddAsyncSecundario.push({entity: 'Direccion', idSource: row.direccion.id});
                                    requestAdd2.push(this.direccionService.add(row.direccion as Direccion));
                                    //alta de detalles
                                    if (row.verificaciones.length > 0) {
                                        row.verificaciones.forEach(async row2 => {
                                            row2.idInhumado = inhumado.id;
                                            logAddAsyncSecundario.push({entity: 'Verificacion', idSource: row2.id});
                                            requestAdd2.push(this.verificacionService.add(row2 as Verificacion));
                                        });

                                        Promise.all(requestAdd2)
                                        .then(responses2 => {
                                            //actualizo las id definitivas (para las altas)
                                            for(let i=0; i<responses2.length; i++) {
                                                logAddAsyncSecundario[offset_logAddAsyncSecundario + i].idTarget = responses2[i].id;
                                            }
                                            resolve2(inhumado);
                                        })
                                        .catch(reject2);
                                    }
                                    else {
                                        resolve2(inhumado);
                                    }
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
                            //modificacion de inhumado
                            requestOther.push(this.inhumadoService.modify(row.id, row as Inhumado));
                            //modificacion de la direccion
                            requestOther.push(this.direccionService.modify(row.direccion.id, row.direccion as Direccion));
                            //modificacion de detalles
                            row.verificaciones.forEach(async row2 => {
                                if (row2.state === 'a') {
                                    logAddAsyncPrimario.push({entity: 'Verificacion', idSource: row2.id});
                                    requestAdd.push(this.verificacionService.add(row2 as Verificacion));
                                }
                                else if (row2.state === 'm') {
                                    requestOther.push(this.verificacionService.modify(row2.id, row2 as Verificacion));
                                }
                                else if (row2.state === 'r') {
                                    requestOther.push(this.verificacionService.remove(row2.id));
                                }
                            });
                        }
                        else if (row.state === 'c') {
                            row.verificaciones.forEach(async row2 => {
																		  
                                if (row2.state === 'a') {
                                    logAddAsyncPrimario.push({entity: 'Verificacion', idSource: row2.id});
                                    requestAdd.push(this.verificacionService.add(row2 as Verificacion));
                                }
                                else if (row2.state === 'm') {
                                    requestOther.push(this.verificacionService.modify(row2.id, row2 as Verificacion));
                                }
                                else if (row2.state === 'r') {
                                    requestOther.push(this.verificacionService.remove(row2.id));
                                }
                            });
                        }
                        else if (row.state === 'r') {
                            requestOther.push(this.inhumadoService.remove(row.id));
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
                            if (cementerioDTO.zonasEntrega.length > 0) {
                                await this.cuentaService.updateDireccionEntrega(idCuenta);
                            }

                            //unifico los logs
                            const logAdd = logAddAsyncPrimario.concat(logAddAsyncSecundario);
                            //proceso los archivos, observaciones y etiquetas
                            let informacionAdicionalDTO = new InformacionAdicionalDTO(cementerioDTO.archivos, cementerioDTO.observaciones, cementerioDTO.etiquetas);
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
        const resultTransaction = this.cementerioRepository.onTransaction( async () => {
            return new Promise( async (resolve, reject) => {
                try {
                    let cementerioDTO = new CementerioDTO();            
                    cementerioDTO.cementerio = await this.cementerioRepository.findById(id) as Cementerio;
                    if (!cementerioDTO.cementerio) {
                        reject(new ReferenceError('No existe el registro'));
                        return;
                    }
                    let idCuenta = cementerioDTO.cementerio.idCuenta;

                    await this.cuentaService.unbindAllContribuyentes(idCuenta);
                    await this.variableCuentaService.removeByCuenta(idCuenta);
                    await this.vinculoCementerioService.removeByCementerio(id);
                    await this.relacionCuentaService.removeByCuenta(idCuenta);
                    await this.zonaEntregaService.removeByCuenta(idCuenta);
                    await this.controladorCuentaService.removeByCuenta(idCuenta);
                    await this.condicionEspecialService.removeByCuenta(idCuenta);
                    await this.recargoDescuentoService.removeByCuenta(idCuenta);
                    await this.debitoAutomaticoService.removeByCuenta(idCuenta);
                    await this.inhumadoService.removeByCementerio(id);

                    const cementerio = await this.cementerioRepository.findById(id);
                    if (!cementerio) {
                        reject(new ReferenceError('No existe el registro'));
                        return;
                    }
                    const result = await this.cementerioRepository.remove(id);
                    if (!result) {
                        reject(new ReferenceError('No existe el registro'));
                        return;
                    }
                    await this.cuentaService.remove(cementerio.idCuenta);
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
