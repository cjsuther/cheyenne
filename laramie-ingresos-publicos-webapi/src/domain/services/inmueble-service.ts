import Inmueble from '../entities/inmueble';
import Cuenta from '../entities/cuenta';
import RelacionCuenta from '../entities/relacion-cuenta';
import Direccion from '../entities/direccion';
import VariableCuenta from '../entities/variable-cuenta';
import VinculoInmueble from '../entities/vinculo-inmueble';
import LadoTerreno from '../entities/lado-terreno';
import LadoTerrenoServicio from '../entities/lado-terreno-servicio';
import LadoTerrenoObra from '../entities/lado-terreno-obra';
import ZonaEntrega from '../entities/zona-entrega';
import ControladorCuenta from '../entities/controlador-cuenta';
import Valuacion from '../entities/valuacion';
import ObraInmueble from '../entities/obra-inmueble';
import ObraInmuebleDetalle from '../entities/obra-inmueble-detalle';
import CondicionEspecial from '../entities/condicion-especial';
import Superficie from '../entities/superficie';
import Edesur from '../entities/edesur';
import EdesurCliente from '../entities/edesur-cliente';
import RecargoDescuento from '../entities/recargo-descuento';
import DebitoAutomatico from '../entities/debito-automatico';

import InmuebleRow from '../dto/inmueble-row';
import InmuebleFilter from '../dto/inmueble-filter';
import InmuebleDTO from '../dto/inmueble-dto';
import RelacionCuentaState from '../dto/relacion-cuenta-state';
import InformacionAdicionalDTO from '../dto/informacion-adicional-dto';
import ArchivoState from '../dto/archivo-state';
import ObservacionState from '../dto/observacion-state';
import EtiquetaState from '../dto/etiqueta-state';
import VariableCuentaState from '../dto/variable-cuenta-state';
import VinculoInmuebleState from '../dto/vinculo-inmueble-state';
import LadoTerrenoState from '../dto/lado-terreno-state';
import ZonaEntregaState from '../dto/zona-entrega-state';
import ControladorCuentaState from '../dto/controlador-cuenta-state';
import ValuacionState from '../dto/valuacion-state';
import ObraInmuebleState from '../dto/obra-inmueble-state';
import CondicionEspecialState from '../dto/condicion-especial-state';
import SuperficieState from '../dto/superficie-state';
import EdesurState from '../dto/edesur-state';
import RecargoDescuentoState from '../dto/recargo-descuento-state';
import DebitoAutomaticoState from '../dto/debito-automatico-state';

import IInmuebleRepository from '../repositories/inmueble-repository';
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
import VinculoInmuebleService from './vinculo-inmueble-service';
import LadoTerrenoService from './lado-terreno-service';
import LadoTerrenoServicioService from './lado-terreno-servicio-service';
import LadoTerrenoObraService from './lado-terreno-obra-service';
import ZonaEntregaService from './zona-entrega-service';
import ControladorCuentaService from './controlador-cuenta-service';
import ValuacionService from './valuacion-service';
import ObraInmuebleService from './obra-inmueble-service';
import ObraInmuebleDetalleService from './obra-inmueble-detalle-service';
import CondicionEspecialService from './condicion-especial-service';
import SuperficieService from './superficie-service';
import EdesurService from './edesur-service';
import EdesurClienteService from './edesur-cliente-service';
import RecargoDescuentoService from './recargo-descuento-service';
import DebitoAutomaticoService from './debito-automatico-service';

import { isValidString, isValidInteger, isValidBoolean } from '../../infraestructure/sdk/utils/validator';
import { getDateNow } from '../../infraestructure/sdk/utils/convert';
import { distinctArray } from '../../infraestructure/sdk/utils/helper';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import PersonaMin from '../dto/persona-min';
import CuentaCalculo from '../dto/cuenta-calculo';
import CuentaOrdenamiento from '../dto/cuenta-ordenamiento';


export default class InmuebleService {

    inmuebleRepository: IInmuebleRepository;
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
    vinculoInmuebleService: VinculoInmuebleService;
    ladoTerrenoService: LadoTerrenoService;
    ladoTerrenoServicioService: LadoTerrenoServicioService;
    ladoTerrenoObraService: LadoTerrenoObraService;
    zonaEntregaService: ZonaEntregaService;
    controladorCuentaService: ControladorCuentaService;
    valuacionService: ValuacionService;
    obraInmuebleService: ObraInmuebleService;
    obraInmuebleDetalleService: ObraInmuebleDetalleService;
    condicionEspecialService: CondicionEspecialService;
    superficieService: SuperficieService;
    edesurService: EdesurService;
    edesurClienteService: EdesurClienteService;
    recargoDescuentoService: RecargoDescuentoService;
    debitoAutomaticoService: DebitoAutomaticoService;

    constructor(inmuebleRepository: IInmuebleRepository, contribuyenteService: ContribuyenteService, cuentaService: CuentaService, relacionCuentaService: RelacionCuentaService,
                direccionService: DireccionService, informacionAdicionalService: InformacionAdicionalService,
                archivoService: ArchivoService, observacionService: ObservacionService, etiquetaService: EtiquetaService,
                variableService: VariableService, variableCuentaService: VariableCuentaService, vinculoInmuebleService: VinculoInmuebleService,
                ladoTerrenoService: LadoTerrenoService, ladoTerrenoServicioService: LadoTerrenoServicioService, ladoTerrenoObraService: LadoTerrenoObraService,
                zonaEntregaService: ZonaEntregaService, controladorCuentaService: ControladorCuentaService, valuacionService: ValuacionService,
                obraInmuebleService: ObraInmuebleService, obraInmuebleDetalleService: ObraInmuebleDetalleService,
                condicionEspecialService: CondicionEspecialService, superficieService: SuperficieService,
                edesurService: EdesurService, edesurClienteService: EdesurClienteService,
                recargoDescuentoService: RecargoDescuentoService, debitoAutomaticoService: DebitoAutomaticoService
    ) {
        this.inmuebleRepository = inmuebleRepository;
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
        this.vinculoInmuebleService = vinculoInmuebleService;
        this.ladoTerrenoService = ladoTerrenoService;
        this.ladoTerrenoServicioService = ladoTerrenoServicioService;
        this.ladoTerrenoObraService = ladoTerrenoObraService;
        this.zonaEntregaService = zonaEntregaService;
        this.controladorCuentaService = controladorCuentaService;
        this.valuacionService = valuacionService;
        this.obraInmuebleService = obraInmuebleService;
        this.obraInmuebleDetalleService = obraInmuebleDetalleService;
        this.condicionEspecialService = condicionEspecialService;
        this.superficieService = superficieService;
        this.edesurService = edesurService;
        this.edesurClienteService = edesurClienteService;
        this.recargoDescuentoService = recargoDescuentoService;
        this.debitoAutomaticoService = debitoAutomaticoService;
    }

    async listByCuenta(inmuebleFilter: InmuebleFilter) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = (await this.inmuebleRepository.listByCuenta(inmuebleFilter) as Array<InmuebleRow>).sort((a, b) => a.id - b.id);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async listByUbicacion(inmuebleFilter: InmuebleFilter) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = (await this.inmuebleRepository.listByUbicacion(inmuebleFilter) as Array<InmuebleRow>).sort((a, b) => a.id - b.id);
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
                let inmuebleDTO = new InmuebleDTO();            
                inmuebleDTO.inmueble = await this.inmuebleRepository.findById(id) as Inmueble;
                if (!inmuebleDTO.inmueble) {
                    reject(new ReferenceError('No existe el registro'));
                    return;
                }
                let idCuenta = inmuebleDTO.inmueble.idCuenta;

                inmuebleDTO.cuenta = await this.cuentaService.findById(inmuebleDTO.inmueble.idCuenta) as Cuenta;
                inmuebleDTO.relacionesCuentas = await this.relacionCuentaService.listByCuenta(idCuenta) as Array<RelacionCuentaState>;
                inmuebleDTO.archivos = await this.archivoService.listByInmueble(id) as Array<ArchivoState>;
                inmuebleDTO.observaciones = await this.observacionService.listByInmueble(id) as Array<ObservacionState>;
                inmuebleDTO.etiquetas = await this.etiquetaService.listByInmueble(id) as Array<EtiquetaState>;
                inmuebleDTO.variablesCuenta = await this.variableCuentaService.listByCuenta(idCuenta) as Array<VariableCuentaState>;
                inmuebleDTO.vinculosInmueble = await this.vinculoInmuebleService.listByInmueble(id) as Array<VinculoInmuebleState>;
                inmuebleDTO.ladosTerreno = await this.ladoTerrenoService.listByInmueble(id) as Array<LadoTerrenoState>;
                inmuebleDTO.zonasEntrega = await this.zonaEntregaService.listByCuenta(idCuenta) as Array<ZonaEntregaState>;
                inmuebleDTO.controladoresCuentas = await this.controladorCuentaService.listByCuenta(idCuenta) as Array<ControladorCuentaState>;
                inmuebleDTO.valuaciones = await this.valuacionService.listByInmueble(id) as Array<ValuacionState>;
                inmuebleDTO.obrasInmueble = await this.obraInmuebleService.listByInmueble(id) as Array<ObraInmuebleState>;
                inmuebleDTO.condicionesEspeciales = await this.condicionEspecialService.listByCuenta(idCuenta) as Array<CondicionEspecialState>;
                inmuebleDTO.superficies = await this.superficieService.listByInmueble(id) as Array<SuperficieState>;
                inmuebleDTO.edesur = await this.edesurService.listByInmueble(id) as Array<EdesurState>;
                inmuebleDTO.recargosDescuentos = await this.recargoDescuentoService.listByCuenta(idCuenta) as Array<RecargoDescuentoState>;
                inmuebleDTO.debitosAutomaticos = await this.debitoAutomaticoService.listByCuenta(idCuenta) as Array<DebitoAutomaticoState>;

                resolve(inmuebleDTO);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async findByCuenta(idCuenta: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.inmuebleRepository.findByCuenta(idCuenta);
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

    async add(inmuebleDTO: InmuebleDTO) {
        const resultTransaction = this.inmuebleRepository.onTransaction( async () => {
            return new Promise( async (resolve, reject) => {
                try {
                    if (!isValidInteger(inmuebleDTO.inmueble.idEstadoCarga, true) ||
                        !isValidString(inmuebleDTO.inmueble.catastralCir, false) ||
                        !isValidString(inmuebleDTO.inmueble.catastralSec, false) ||
                        !isValidString(inmuebleDTO.inmueble.catastralChacra, false) ||
                        !isValidString(inmuebleDTO.inmueble.catastralLchacra, false) ||
                        !isValidString(inmuebleDTO.inmueble.catastralQuinta, false) ||
                        !isValidString(inmuebleDTO.inmueble.catastralLquinta, false) ||
                        !isValidString(inmuebleDTO.inmueble.catastralFrac, false) ||
                        !isValidString(inmuebleDTO.inmueble.catastralLfrac, false) ||
                        !isValidString(inmuebleDTO.inmueble.catastralManz, false) ||
                        !isValidString(inmuebleDTO.inmueble.catastralLmanz, false) ||
                        !isValidString(inmuebleDTO.inmueble.catastralParc, false) ||
                        !isValidString(inmuebleDTO.inmueble.catastralLparc, false) ||
                        !isValidString(inmuebleDTO.inmueble.catastralSubparc, false) ||
                        !isValidString(inmuebleDTO.inmueble.catastralUfunc, false) ||
                        !isValidString(inmuebleDTO.inmueble.catastralUcomp, false) ||
                        !isValidString(inmuebleDTO.inmueble.catastralRtasPrv, false) ||
                        !isValidString(inmuebleDTO.inmueble.tributoManz, false) ||
                        !isValidString(inmuebleDTO.inmueble.tributoLote, false) ||
                        !isValidBoolean(inmuebleDTO.inmueble.tributoEsquina)
                    ) {
                        reject(new ValidationError('Existen campos incompletos'));
                        return;
                    }
                    
                    inmuebleDTO.inmueble.idCuenta = null;
                    inmuebleDTO.inmueble.idEstadoCarga = 20; //Incompleta
                    inmuebleDTO.inmueble.fechaCargaInicio = getDateNow();
                    inmuebleDTO.inmueble.fechaCargaFin = null;
                    inmuebleDTO.inmueble = await this.inmuebleRepository.add(inmuebleDTO.inmueble) as Inmueble;

                    inmuebleDTO.cuenta.idTipoTributo = 10; //10: Inmueble
                    inmuebleDTO.cuenta.idTributo = inmuebleDTO.inmueble.id;
                    inmuebleDTO.cuenta.idEstadoCuenta = 1; //Pendiente
                    inmuebleDTO.cuenta = await this.cuentaService.add(inmuebleDTO.cuenta) as Cuenta;

                    inmuebleDTO.inmueble.idCuenta = inmuebleDTO.cuenta.id;
                    await this.inmuebleRepository.modify(inmuebleDTO.inmueble.id, inmuebleDTO.inmueble);

                    resolve(inmuebleDTO);
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

    async modify(id: number, idUsuario: number, inmuebleDTO: InmuebleDTO) {
        const resultTransaction = this.inmuebleRepository.onTransaction( async () => {
            return new Promise( async (resolve, reject) => {
                try {
                    if (!isValidInteger(inmuebleDTO.inmueble.idCuenta, true) ||
                        !isValidInteger(inmuebleDTO.inmueble.idEstadoCarga, true) ||
                        !isValidString(inmuebleDTO.inmueble.catastralCir, false) ||
                        !isValidString(inmuebleDTO.inmueble.catastralSec, false) ||
                        !isValidString(inmuebleDTO.inmueble.catastralChacra, false) ||
                        !isValidString(inmuebleDTO.inmueble.catastralLchacra, false) ||
                        !isValidString(inmuebleDTO.inmueble.catastralQuinta, false) ||
                        !isValidString(inmuebleDTO.inmueble.catastralLquinta, false) ||
                        !isValidString(inmuebleDTO.inmueble.catastralFrac, false) ||
                        !isValidString(inmuebleDTO.inmueble.catastralLfrac, false) ||
                        !isValidString(inmuebleDTO.inmueble.catastralManz, false) ||
                        !isValidString(inmuebleDTO.inmueble.catastralLmanz, false) ||
                        !isValidString(inmuebleDTO.inmueble.catastralParc, false) ||
                        !isValidString(inmuebleDTO.inmueble.catastralSubparc, false) ||
                        !isValidString(inmuebleDTO.inmueble.catastralLparc, false) ||
                        !isValidString(inmuebleDTO.inmueble.catastralUfunc, false) ||
                        !isValidString(inmuebleDTO.inmueble.catastralUcomp, false) ||
                        !isValidString(inmuebleDTO.inmueble.catastralRtasPrv, false) ||
                        !isValidString(inmuebleDTO.inmueble.tributoManz, false) ||
                        !isValidString(inmuebleDTO.inmueble.tributoLote, false) ||
                        !isValidBoolean(inmuebleDTO.inmueble.tributoEsquina)
                    ) {
                        reject(new ValidationError('Existen campos incompletos'));
                        return;
                    }

                    //los contribuyentes surgen entre responsables de cuenta y titulares (debe haber al menos un contribuyente)
                    let vinculosContribuyente = inmuebleDTO.vinculosInmueble.filter(f => [50,51].includes(f.idTipoVinculoInmueble) && f.state !== 'r');
                    vinculosContribuyente.sort((a,b) =>a.idTipoVinculoInmueble - b.idTipoVinculoInmueble);
                    if (vinculosContribuyente.length === 0) {
                        reject(new ValidationError('Debe vincular al menos un titular o responsable de cuenta'));
                        return;
                    }
                    let idCuenta = inmuebleDTO.inmueble.idCuenta;

                    //si hubo algun cambio, entonces valido la consistencia de los rangos de fechas de las variables
                    if (inmuebleDTO.variablesCuenta.filter(f => f.state !== 'o').length > 0) {
                        if (!this.variableCuentaService.validateDateRange(inmuebleDTO.variablesCuenta)) {
                            reject(new ValidationError(`Existen rangos de fechas de variables que se superponen`));
                            return;
                        }
                    }

                    //EstadoCarga => 20: Incompleta y 21:Completa
                    //EstadoCuenta => 1: Pendiente y 2:Activa
                    inmuebleDTO.inmueble.fechaCargaFin = (inmuebleDTO.inmueble.idEstadoCarga == 21) ? getDateNow() : null;
                    inmuebleDTO.inmueble = await this.inmuebleRepository.modify(id, inmuebleDTO.inmueble) as Inmueble;
                    
                    inmuebleDTO.cuenta.idEstadoCuenta = (inmuebleDTO.inmueble.idEstadoCarga == 20) ? 1 : 2;
                    inmuebleDTO.cuenta = await this.cuentaService.modify(idCuenta, inmuebleDTO.cuenta) as Cuenta;

                    let logAddAsyncPrimario = [];
                    let logAddAsyncSecundario = [];
                    let requestAdd = [];
                    let requestOther = [];

                    //verifico si tengo que hacer cambios (ya que inmuebleDTO.vinculosInmueble incluye registros originales)
                    const contribuyentesUpdates = inmuebleDTO.vinculosInmueble.filter(f => f.state !== 'o').length;
                    if (contribuyentesUpdates > 0) {
                        const personasContribuyenteIDs = distinctArray(vinculosContribuyente.map(x => x.idPersona));
                        const personasVinculo: Array<PersonaMin> = inmuebleDTO.vinculosInmueble.map(vinculo => {
                            const persona = new PersonaMin();
                            persona.setFromObject({...vinculo});
                            return persona;
                        }) as Array<PersonaMin>;
                        await this.cuentaService.updateContribuyentes(idCuenta, personasVinculo, personasContribuyenteIDs);
                    }

                    //como viajan todos, tengo que filtrar ahora
                    inmuebleDTO.vinculosInmueble.filter(f => f.state !== 'o').forEach(async row => {
                        if (row.state === 'a') {
                            logAddAsyncPrimario.push({entity: 'VinculoInmueble', idSource: row.id});
                            requestAdd.push(this.vinculoInmuebleService.add(row as VinculoInmueble));
                        }
                        else if (row.state === 'm') {
                            requestOther.push(this.vinculoInmuebleService.modify(row.id, row as VinculoInmueble));
                        }
                        else if (row.state === 'r') {
                            requestOther.push(this.vinculoInmuebleService.remove(row.id));
                        }
                    });
                    //como viajan todos, tengo que filtrar ahora
                    inmuebleDTO.variablesCuenta.filter(f => f.state !== 'o').forEach(async row => {
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

                    inmuebleDTO.relacionesCuentas.forEach(async row => {
                        if (row.state === 'a') {
                            logAddAsyncPrimario.push({entity: 'RelacionCuenta', idSource: row.id});
                            requestAdd.push(this.relacionCuentaService.add(row as RelacionCuenta));
                        }
                        else if (row.state === 'r') {
                            requestOther.push(this.relacionCuentaService.remove(row.id));
                        }
                    });
                    

                    inmuebleDTO.zonasEntrega.forEach(async row => {
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

                    inmuebleDTO.controladoresCuentas.forEach(async row => {
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

                    inmuebleDTO.condicionesEspeciales.forEach(async row => {
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

                    inmuebleDTO.recargosDescuentos.forEach(async row => {
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

                    inmuebleDTO.debitosAutomaticos.forEach(async row => {
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


                    inmuebleDTO.ladosTerreno.forEach(async row => {
                        if (row.state === 'a') {
                            logAddAsyncPrimario.push({entity: 'LadoTerreno', idSource: row.id});
                            requestAdd.push(new Promise(async (resolve2, reject2) => {
                                try {
                                    //alta de lado del terreno
                                    const ladoTerreno = await this.ladoTerrenoService.add(row as LadoTerreno) as LadoTerreno;

                                    let requestAdd2 = [];
                                    const offset_logAddAsyncSecundario = logAddAsyncSecundario.length;
                                    //alta de la direccion
                                    row.direccion.idEntidad = ladoTerreno.id;
                                    logAddAsyncSecundario.push({entity: 'Direccion', idSource: row.direccion.id});
                                    requestAdd2.push(this.direccionService.add(row.direccion as Direccion, row.idTipoLado !== 40));
                                    //alta de servicios y obras
                                    if (row.ladosTerrenoServicio.length > 0 || row.ladosTerrenoObra.length > 0) {
                                        row.ladosTerrenoServicio.forEach(async row2 => {
                                            row2.idLadoTerreno = ladoTerreno.id;
                                            logAddAsyncSecundario.push({entity: 'LadoTerrenoServicio', idSource: row2.id});
                                            requestAdd2.push(this.ladoTerrenoServicioService.add(row2 as LadoTerrenoServicio));
                                        });
                                        row.ladosTerrenoObra.forEach(async row2 => {
                                            row2.idLadoTerreno = ladoTerreno.id;
                                            logAddAsyncSecundario.push({entity: 'LadoTerrenoObra', idSource: row2.id});
                                            requestAdd2.push(this.ladoTerrenoObraService.add(row2 as LadoTerrenoObra));
                                        });
                                    }

                                    Promise.all(requestAdd2)
                                    .then(responses2 => {
                                        //actualizo las id definitivas (para las altas)
                                        for(let i=0; i<responses2.length; i++) {
                                            logAddAsyncSecundario[offset_logAddAsyncSecundario + i].idTarget = responses2[i].id;
                                        }
                                        resolve2(ladoTerreno);
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
                            //modificacion de lado del terreno
                            requestOther.push(this.ladoTerrenoService.modify(row.id, row as LadoTerreno));
                            //modificacion de la direccion
                            requestOther.push(this.direccionService.modify(row.direccion.id, row.direccion as Direccion, row.idTipoLado !== 40));
                            //modificacion de servicios y obras
                            row.ladosTerrenoServicio.forEach(async row2 => {
                                if (row2.state === 'a') {
                                    logAddAsyncPrimario.push({entity: 'LadoTerrenoServicio', idSource: row2.id});
                                    requestAdd.push(this.ladoTerrenoServicioService.add(row2 as LadoTerrenoServicio));
                                }
                                else if (row2.state === 'm') {
                                    requestOther.push(this.ladoTerrenoServicioService.modify(row2.id, row2 as LadoTerrenoServicio));
                                }
                                else if (row2.state === 'r') {
                                    requestOther.push(this.ladoTerrenoServicioService.remove(row2.id));
                                }
                            });
                            row.ladosTerrenoObra.forEach(async row2 => {
                                if (row2.state === 'a') {
                                    logAddAsyncPrimario.push({entity: 'LadoTerrenoObra', idSource: row2.id});
                                    requestAdd.push(this.ladoTerrenoObraService.add(row2 as LadoTerrenoObra));
                                }
                                else if (row2.state === 'm') {
                                    requestOther.push(this.ladoTerrenoObraService.modify(row2.id, row2 as LadoTerrenoObra));
                                }
                                else if (row2.state === 'r') {
                                    requestOther.push(this.ladoTerrenoObraService.remove(row2.id));
                                }
                            });
                        }
                        else if (row.state === 'c') {
                            row.ladosTerrenoServicio.forEach(async row2 => {
                                if (row2.state === 'a') {
                                    logAddAsyncPrimario.push({entity: 'LadoTerrenoServicio', idSource: row2.id});
                                    requestAdd.push(this.ladoTerrenoServicioService.add(row2 as LadoTerrenoServicio));
                                }
                                else if (row2.state === 'm') {
                                    requestOther.push(this.ladoTerrenoServicioService.modify(row2.id, row2 as LadoTerrenoServicio));
                                }
                                else if (row2.state === 'r') {
                                    requestOther.push(this.ladoTerrenoServicioService.remove(row2.id));
                                }
                            });
                            row.ladosTerrenoObra.forEach(async row2 => {
                                if (row2.state === 'a') {
                                    logAddAsyncPrimario.push({entity: 'LadoTerrenoObra', idSource: row2.id});
                                    requestAdd.push(this.ladoTerrenoObraService.add(row2 as LadoTerrenoObra));
                                }
                                else if (row2.state === 'm') {
                                    requestOther.push(this.ladoTerrenoObraService.modify(row2.id, row2 as LadoTerrenoObra));
                                }
                                else if (row2.state === 'r') {
                                    requestOther.push(this.ladoTerrenoObraService.remove(row2.id));
                                }
                            });
                        }
                        else if (row.state === 'r') {
                            requestOther.push(this.ladoTerrenoService.remove(row.id));
                        }
                    });

                    inmuebleDTO.valuaciones.forEach(async row => {
                        if (row.state === 'a') {
                            logAddAsyncPrimario.push({entity: 'Valuacion', idSource: row.id});
                            requestAdd.push(this.valuacionService.add(row as Valuacion));
                        }
                        else if (row.state === 'm') {
                            requestOther.push(this.valuacionService.modify(row.id, row as Valuacion));
                        }
                        else if (row.state === 'r') {
                            requestOther.push(this.valuacionService.remove(row.id));
                        }
                    });

                    inmuebleDTO.obrasInmueble.forEach(async row => {
                        if (row.state === 'a') {
                            logAddAsyncPrimario.push({entity: 'ObraInmueble', idSource: row.id});
                            requestAdd.push(new Promise(async (resolve2, reject2) => {
                                try {
                                    //alta de obra
                                    const obraInmueble = await this.obraInmuebleService.add(row as ObraInmueble) as ObraInmueble;

                                    //alta de detalles
                                    if (row.obrasInmuebleDetalle.length > 0) {
                                        const offset_logAddAsyncSecundario = logAddAsyncSecundario.length;
                                        let requestAdd2 = [];
                                        row.obrasInmuebleDetalle.forEach(async row2 => {
                                            row2.idObraInmueble = obraInmueble.id;
                                            logAddAsyncSecundario.push({entity: 'ObraInmuebleDetalle', idSource: row2.id});
                                            requestAdd2.push(this.obraInmuebleDetalleService.add(row2 as ObraInmuebleDetalle));
                                        });

                                        Promise.all(requestAdd2)
                                        .then(responses2 => {
                                            //actualizo las id definitivas (para las altas)
                                            for(let i=0; i<responses2.length; i++) {
                                                logAddAsyncSecundario[offset_logAddAsyncSecundario + i].idTarget = responses2[i].id;
                                            }
                                            resolve2(obraInmueble);
                                        })
                                        .catch(reject2);
                                    }
                                    else {
                                        resolve2(obraInmueble);
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
                            //modificacion de obra
                            requestOther.push(this.obraInmuebleService.modify(row.id, row as ObraInmueble));
                            //modificacion de detalles
                            row.obrasInmuebleDetalle.forEach(async row2 => {
                                if (row2.state === 'a') {
                                    logAddAsyncPrimario.push({entity: 'ObraInmuebleDetalle', idSource: row2.id});
                                    requestAdd.push(this.obraInmuebleDetalleService.add(row2 as ObraInmuebleDetalle));
                                }
                                else if (row2.state === 'm') {
                                    requestOther.push(this.obraInmuebleDetalleService.modify(row2.id, row2 as ObraInmuebleDetalle));
                                }
                                else if (row2.state === 'r') {
                                    requestOther.push(this.obraInmuebleDetalleService.remove(row2.id));
                                }
                            });
                        }
                        else if (row.state === 'c') {
                            row.obrasInmuebleDetalle.forEach(async row2 => {
                                if (row2.state === 'a') {
                                    logAddAsyncPrimario.push({entity: 'ObraInmuebleDetalle', idSource: row2.id});
                                    requestAdd.push(this.obraInmuebleDetalleService.add(row2 as ObraInmuebleDetalle));
                                }
                                else if (row2.state === 'm') {
                                    requestOther.push(this.obraInmuebleDetalleService.modify(row2.id, row2 as ObraInmuebleDetalle));
                                }
                                else if (row2.state === 'r') {
                                    requestOther.push(this.obraInmuebleDetalleService.remove(row2.id));
                                }
                            });
                        }
                        else if (row.state === 'r') {
                            requestOther.push(this.obraInmuebleService.remove(row.id));
                        }
                    });

                    inmuebleDTO.superficies.forEach(async row => {
                        if (row.state === 'a') {
                            logAddAsyncPrimario.push({entity: 'Superficie', idSource: row.id});
                            requestAdd.push(this.superficieService.add(row as Superficie));
                        }
                        else if (row.state === 'm') {
                            requestOther.push(this.superficieService.modify(row.id, row as Superficie));
                        }
                        else if (row.state === 'r') {
                            requestOther.push(this.superficieService.remove(row.id));
                        }
                    });

                    inmuebleDTO.edesur.forEach(async row => {
                        if (row.state === 'a') {
                            logAddAsyncPrimario.push({entity: 'Edesur', idSource: row.id});
                            requestAdd.push(new Promise(async (resolve2, reject2) => {
                                try {
                                    //alta de edesur
                                    const edesur = await this.edesurService.add(row as Edesur) as Edesur;

                                    //alta de detalles
                                    if (row.edesurClientes.length > 0) {
                                        const offset_logAddAsyncSecundario = logAddAsyncSecundario.length;
                                        let requestAdd2 = [];
                                        row.edesurClientes.forEach(async row2 => {
                                            row2.idEdesur = edesur.id;
                                            logAddAsyncSecundario.push({entity: 'EdesurCliente', idSource: row2.id});
                                            requestAdd2.push(this.edesurClienteService.add(row2 as EdesurCliente));
                                        });

                                        Promise.all(requestAdd2)
                                        .then(responses2 => {
                                            //actualizo las id definitivas (para las altas)
                                            for(let i=0; i<responses2.length; i++) {
                                                logAddAsyncSecundario[offset_logAddAsyncSecundario + i].idTarget = responses2[i].id;
                                            }
                                            resolve2(edesur);
                                        })
                                        .catch(reject2);
                                    }
                                    else {
                                        resolve2(edesur);
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
                            //modificacion de obra
                            requestOther.push(this.edesurService.modify(row.id, row as Edesur));
                            //modificacion de detalles
                            row.edesurClientes.forEach(async row2 => {
                                if (row2.state === 'a') {
                                    logAddAsyncPrimario.push({entity: 'EdesurCliente', idSource: row2.id});
                                    requestAdd.push(this.edesurClienteService.add(row2 as EdesurCliente));
                                }
                                else if (row2.state === 'm') {
                                    requestOther.push(this.edesurClienteService.modify(row2.id, row2 as EdesurCliente));
                                }
                                else if (row2.state === 'r') {
                                    requestOther.push(this.edesurClienteService.remove(row2.id));
                                }
                            });
                        }
                        else if (row.state === 'c') {
                            row.edesurClientes.forEach(async row2 => {
                                if (row2.state === 'a') {
                                    logAddAsyncPrimario.push({entity: 'EdesurCliente', idSource: row2.id});
                                    requestAdd.push(this.edesurClienteService.add(row2 as EdesurCliente));
                                }
                                else if (row2.state === 'm') {
                                    requestOther.push(this.edesurClienteService.modify(row2.id, row2 as EdesurCliente));
                                }
                                else if (row2.state === 'r') {
                                    requestOther.push(this.edesurClienteService.remove(row2.id));
                                }
                            });
                        }
                        else if (row.state === 'r') {
                            requestOther.push(this.edesurService.remove(row.id));
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
                            if (inmuebleDTO.zonasEntrega.length > 0) {
                                await this.cuentaService.updateDireccionEntrega(idCuenta);
                            }
                            //verifico el domicilio principal
                            if (inmuebleDTO.ladosTerreno.length > 0) {
                                await this.cuentaService.updateDireccionPrincipal(idCuenta);
                            }

                            //unifico los logs
                            const logAdd = logAddAsyncPrimario.concat(logAddAsyncSecundario);
                            //proceso los archivos, observaciones y etiquetas
                            let informacionAdicionalDTO = new InformacionAdicionalDTO(inmuebleDTO.archivos, inmuebleDTO.observaciones, inmuebleDTO.etiquetas);
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
        const resultTransaction = this.inmuebleRepository.onTransaction( async () => {
            return new Promise( async (resolve, reject) => {
                try {
                    let inmuebleDTO = new InmuebleDTO();            
                    inmuebleDTO.inmueble = await this.inmuebleRepository.findById(id) as Inmueble;
                    if (!inmuebleDTO.inmueble) {
                        reject(new ReferenceError('No existe el registro'));
                        return;
                    }
                    let idCuenta = inmuebleDTO.inmueble.idCuenta;

                    await this.cuentaService.unbindAllContribuyentes(idCuenta);
                    await this.variableCuentaService.removeByCuenta(idCuenta);
                    await this.vinculoInmuebleService.removeByInmueble(id);
                    await this.relacionCuentaService.removeByCuenta(idCuenta);
                    await this.zonaEntregaService.removeByCuenta(idCuenta);
                    await this.controladorCuentaService.removeByCuenta(idCuenta);
                    await this.condicionEspecialService.removeByCuenta(idCuenta);
                    await this.recargoDescuentoService.removeByCuenta(idCuenta);
                    await this.debitoAutomaticoService.removeByCuenta(idCuenta);
                    await this.ladoTerrenoService.removeByInmueble(id);
                    await this.superficieService.removeByInmueble(id);
                    await this.edesurService.removeByInmueble(id);
                    await this.valuacionService.removeByInmueble(id);
                    await this.obraInmuebleService.removeByInmueble(id);

                    const inmueble = await this.inmuebleRepository.findById(id);
                    if (!inmueble) {
                        reject(new ReferenceError('No existe el registro'));
                        return;
                    }
                    const result = await this.inmuebleRepository.remove(id);
                    if (!result) {
                        reject(new ReferenceError('No existe el registro'));
                        return;
                    }
                    await this.cuentaService.remove(inmueble.idCuenta);
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
