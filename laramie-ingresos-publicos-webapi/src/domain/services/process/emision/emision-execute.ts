import { Mutex } from 'async-mutex';

import EmisionDefinicionDTO from '../../../dto/emision-definicion-dto';
import EmisionEjecucionDTO from '../../../dto/emision-ejecucion-dto';
import EmisionDefinicion from "../../../entities/emision-definicion";
import EmisionEjecucion from "../../../entities/emision-ejecucion";
import EmisionEjecucionCuenta from "../../../entities/emision-ejecucion-cuenta";
import EmisionEjecucionCuota from '../../../entities/emision-ejecucion-cuota';
import Procedimiento from '../../../entities/procedimiento';
import EmisionCuota from '../../../entities/emision-cuota';
import EmisionCalculo from "../../../entities/emision-calculo";
import EmisionConcepto from '../../../entities/emision-concepto';
import EmisionCuentaCorriente from '../../../entities/emision-cuenta-corriente';
import EmisionImputacionContable from '../../../entities/emision-imputacion-contable';
import Variable from '../../../entities/variable';
import Coleccion from '../../../entities/coleccion';
import ColeccionCampo from '../../../entities/coleccion-campo';

import EmisionDefinicionService from "../../emision-definicion-service";
import EmisionEjecucionService from "../../emision-ejecucion-service";
import EmisionEjecucionCuentaService from "../../emision-ejecucion-cuenta-service";
import EmisionEjecucionCuotaService from "../../emision-ejecucion-cuota-service";
import ProcedimientoService from '../../procedimiento-service';
import EmisionCalculoResultadoService from "../../emision-calculo-resultado-service";
import EmisionConceptoResultadoService from '../../emision-concepto-resultado-service';
import EmisionCuentaCorrienteResultadoService from '../../emision-cuenta-corriente-resultado-service';
import EmisionImputacionContableResultadoService from '../../emision-imputacion-contable-resultado-service';
import ClaseElementoService from "../../clase-elemento-service";
import TipoElementoService from "../../tipo-elemento-service";
import ElementoService from "../../elemento-service";
import DeclaracionJuradaComercioService from "../../declaracion-jurada-comercio-service";
import DeclaracionJuradaRubroService from "../../declaracion-jurada-rubro-service";
import TipoRubroComercioService from "../../tipo-rubro-comercio-service";
import RubroComercioService from "../../rubro-comercio-service";
import VariableService from '../../variable-service';
import ColeccionService from '../../coleccion-service';

import EmisionProcedure from './emision-procedure';
import EmisionResource from "./emision-resource";
import EmisionReader from "./emision-reader";
import EmisionWorker from "./emision-worker";
import EmisionWriter from "./emision-writer";

import ProcessError from '../../../../infraestructure/sdk/error/process-error';
import ValidationError from '../../../../infraestructure/sdk/error/validation-error';
import { EMISION_STATE } from '../../../../infraestructure/sdk/consts/emisionState';
import { EMISION_EJECUCION_STATE } from '../../../../infraestructure/sdk/consts/emisionEjecucionState';
import config from '../../../../server/configuration/config';
import { castDataType } from '../../../../infraestructure/sdk/utils/convert';
import { isNull } from '../../../../infraestructure/sdk/utils/validator';
import ColeccionData from '../../../dto/coleccion-data';
import ProcedimientoVariable from '../../../entities/procedimiento-variable';
import EmisionVariable from '../../../entities/emision-variable';
import ReferenceError from '../../../../infraestructure/sdk/error/reference-error';
import CustomError from '../../../../infraestructure/sdk/error/custom-error';


export default class EmisionExecute {

    //servicios
    emisionDefinicionService: EmisionDefinicionService;
    emisionEjecucionService: EmisionEjecucionService;
    emisionEjecucionCuentaService: EmisionEjecucionCuentaService;
    emisionEjecucionCuotaService: EmisionEjecucionCuotaService;
    procedimientoService: ProcedimientoService;
    emisionCalculoResultadoService: EmisionCalculoResultadoService;
    emisionConceptoResultadoService: EmisionConceptoResultadoService;
    emisionCuentaCorrienteResultadoService: EmisionCuentaCorrienteResultadoService;
    emisionImputacionContableResultadoService: EmisionImputacionContableResultadoService;
    claseElementoService: ClaseElementoService;
    tipoElementoService: TipoElementoService;
    elementoService: ElementoService;
    declaracionJuradaComercioService: DeclaracionJuradaComercioService;
    declaracionJuradaRubroService: DeclaracionJuradaRubroService;
    tipoRubroComercioService: TipoRubroComercioService;
    rubroComercioService: RubroComercioService;
    variableService: VariableService;
    coleccionService: ColeccionService;

    //objetos globales
    emisionEjecucion: EmisionEjecucion;
    emisionDefinicion: EmisionDefinicion;
    procedimiento: Procedimiento;
    emisionVariables: Array<EmisionVariable>;
    emisionCuotas: Array<EmisionCuota>;
    emisionCalculos: Array<EmisionCalculo>;
    emisionConceptos: Array<EmisionConcepto>;
    emisionCuentasCorrientes: Array<EmisionCuentaCorriente>;
    emisionImputacionesContables: Array<EmisionImputacionContable>;
    variables: Array<Variable>;
    colecciones: Array<ColeccionData>;
    params: object;

    //variables
    counter:number;
    canceled:boolean;
    paused:boolean;
    message:string;
    countReaders:number;
    countWorkers:number;
    countWriters:number;

    //processor
    readers:Array<EmisionReader> = [];
    workers:Array<EmisionWorker> = [];
    writers:Array<EmisionWriter> = [];

    //colas
    emisionResources1: Array<[EmisionCuota, EmisionEjecucionCuenta, boolean]> = [];
    emisionResources2: Array<EmisionResource> = [];
    emisionResources3: Array<EmisionResource> = [];

    //mutex colas
    releaseProcesoGlobal:any;
    mutexProcesoGlobal:Mutex;
    mutexEmisionResources1:Mutex;
    mutexEmisionResources2:Mutex;
    mutexEmisionResources3:Mutex;


    constructor(emisionDefinicionService: EmisionDefinicionService, emisionEjecucionService: EmisionEjecucionService,
                emisionEjecucionCuentaService: EmisionEjecucionCuentaService, emisionEjecucionCuotaService: EmisionEjecucionCuotaService,
                procedimientoService: ProcedimientoService,
                emisionCalculoResultadoService: EmisionCalculoResultadoService,
                emisionConceptoResultadoService: EmisionConceptoResultadoService,
                emisionCuentaCorrienteResultadoService: EmisionCuentaCorrienteResultadoService,
                emisionImputacionContableResultadoService: EmisionImputacionContableResultadoService,
                claseElementoService: ClaseElementoService, tipoElementoService: TipoElementoService, elementoService: ElementoService,
                declaracionJuradaComercioService: DeclaracionJuradaComercioService, declaracionJuradaRubroService: DeclaracionJuradaRubroService,
                tipoRubroComercioService: TipoRubroComercioService, rubroComercioService: RubroComercioService,
                variableService: VariableService, coleccionService: ColeccionService
        ) {
        this.emisionDefinicionService = emisionDefinicionService;
        this.emisionEjecucionService = emisionEjecucionService;
        this.emisionEjecucionCuentaService = emisionEjecucionCuentaService;
        this.emisionEjecucionCuotaService = emisionEjecucionCuotaService;
        this.procedimientoService = procedimientoService;
        this.emisionCalculoResultadoService = emisionCalculoResultadoService;
        this.emisionConceptoResultadoService = emisionConceptoResultadoService;
        this.emisionCuentaCorrienteResultadoService = emisionCuentaCorrienteResultadoService;
        this.emisionImputacionContableResultadoService = emisionImputacionContableResultadoService;
        this.claseElementoService = claseElementoService;
        this.tipoElementoService = tipoElementoService;
        this.elementoService = elementoService;
        this.declaracionJuradaComercioService = declaracionJuradaComercioService;
        this.declaracionJuradaRubroService = declaracionJuradaRubroService;
        this.tipoRubroComercioService = tipoRubroComercioService;
        this.rubroComercioService = rubroComercioService;
        this.variableService = variableService;
        this.coleccionService = coleccionService;

        this.mutexProcesoGlobal = new Mutex();
        this.mutexEmisionResources1 = new Mutex();
        this.mutexEmisionResources2 = new Mutex();
        this.mutexEmisionResources3 = new Mutex();

        this.counter = 0;
        this.canceled = false;
        this.paused = false;
        this.message = '';
        this.countReaders = parseInt(config.EMISION.MAX_READER);
        this.countWorkers = parseInt(config.EMISION.MAX_WORKER);
        this.countWriters = parseInt(config.EMISION.MAX_WRITER);
    }

    async executeReader(reader:EmisionReader = null) {
        try {
            if (!reader || !reader.ready) {
                reader = this.readers.find(f => f.ready);
            }
            if (!reader) return;

            let emisionResource1 = null;
            await this.mutexEmisionResources1.runExclusive(async () => {
                if (this.emisionResources1.length > 0) emisionResource1 = this.emisionResources1.pop();
            });

            if (emisionResource1) {
                const cuota = emisionResource1[0] as EmisionCuota;
                const cuenta = emisionResource1[1] as EmisionEjecucionCuenta;
                const ultimaCuota = emisionResource1[2] as boolean;
                const emisionResource = new EmisionResource(this.emisionDefinicion, this.emisionEjecucion, cuenta, cuota,
                                                            this.emisionCalculos, this.emisionConceptos, this.emisionCuentasCorrientes,
                                                            this.emisionImputacionesContables, this.params, ultimaCuota);
                reader.doProcess(emisionResource)
                .then(data => {
                    //console.log(`${reader.name} done! (Cuenta: ${emisionResource.emisionEjecucionCuenta.idCuenta})`);
                    this.onCompletedReader.bind(this);
                    this.onCompletedReader(reader, data);
                })
                .catch(error => {
                    this.canceled = true;
                    this.message = error.message;
                });
            }
        }
        catch(error) {
            this.canceled = true;
            this.message = `Error ejecutando lectura de datos (${error}))`;
        }
    }
    async onCompletedReader(reader:EmisionReader, emisionResource:EmisionResource) {
        try {
            await this.mutexEmisionResources2.runExclusive(async () => {
                this.emisionResources2.push(emisionResource);
            });
            
            if (!this.canceled && !this.paused) this.executeReader();
            this.executeWorker();

            this.counter++;
            if (this.counter % 500 === 0) {
                this.chekProcess();
            }
        }
        catch(error) {
            this.canceled = true;
            this.message = `Error finalizando lectura de datos (${error}))`;
        }
    }

    async executeWorker(worker:EmisionWorker = null) {
        try {
            if (!worker || !worker.ready) {
                worker = this.workers.find(f => f.ready);
            }
            if (!worker) return;

            let emisionResource = null;
            await this.mutexEmisionResources2.runExclusive(async () => {
                if (this.emisionResources2.length > 0) emisionResource = this.emisionResources2.pop();
            });

            if (emisionResource) {
                worker.doProcess(emisionResource)
                .then(data => {
                    //console.log(`${worker.name} done! (Cuenta: ${emisionResource.emisionEjecucionCuenta.idCuenta})`);
                    this.onCompletedWorker.bind(this);
                    this.onCompletedWorker(worker, data);
                })
                .catch(error => {
                    this.canceled = true;
                    this.message = error.message;
                });
            }
        }
        catch(error) {
            this.canceled = true;
            this.message = `Error ejecutando cálculo de datos (${error}))`;
        }
    }
    async onCompletedWorker(worker:EmisionWorker, emisionResource:EmisionResource) {
        try {
            await this.mutexEmisionResources3.runExclusive(async () => {
                this.emisionResources3.push(emisionResource);
            });

            if (!this.canceled) this.executeWorker();
            this.executeWriter();
        }
        catch(error) {
            this.canceled = true;
            this.message = `Error finalizando cálculo de datos (${error}))`;
        }
    }

    async executeWriter(writer:EmisionWriter = null) {
        try {
            if (!writer || !writer.ready) {
                writer = this.writers.find(f => f.ready);
            }
            if (!writer) return;

            let emisionResource = null;
            await this.mutexEmisionResources3.runExclusive(async () => {
                if (this.emisionResources3.length > 0) emisionResource = this.emisionResources3.pop();
            });

            if (emisionResource) {
                writer.doProcess(emisionResource)
                .then(data => {
                    //console.log(`${writer.name} done! (Cuenta: ${emisionResource.emisionEjecucionCuenta.idCuenta})`);
                    this.onCompletedWriter.bind(this);
                    this.onCompletedWriter(writer, data);
                })
                .catch(error => {
                    this.canceled = true;
                    this.message = error.message;
                });
            }
        }
        catch(error) {
            this.canceled = true;
            this.message = `Error ejecutando grabación de datos (${error}))`;
        }
    }
    async onCompletedWriter(writer:EmisionWriter, emisionResource:EmisionResource) {
        try {
            if (emisionResource.state === EMISION_STATE.WRITE_SUCCESS) {
                //console.log(`La cuenta ${emisionResource.emisionEjecucionCuenta.idCuenta} tuvo exito`);
            }
            else {
                //console.log(`La cuenta ${emisionResource.emisionEjecucionCuenta.idCuenta} tuvo error`);
            }

            //VERIFICACION DE FINALIZACION
            if (this.canceled || (
               (this.emisionResources1.length === 0 || this.paused) &&
                this.emisionResources2.length === 0 &&
                this.emisionResources3.length === 0 &&
                this.readers.filter(f => !f.ready).length === 0 &&
                this.workers.filter(f => !f.ready).length === 0 &&
                this.writers.filter(f => !f.ready).length === 0))
            {
                if (this.mutexProcesoGlobal.isLocked && this.releaseProcesoGlobal) {
                    this.releaseProcesoGlobal();
                }
            }
            else {
                if (!this.canceled) this.executeWriter();
            }
        }
        catch(error) {
            this.canceled = true;
            this.message = `Error finalizando grabación de datos (${error}))`;
        }            
    }

    async execute(idEmisionEjecucion:number) {
        return new Promise( async (resolve, reject) => {
            try {
                //PASO 1: CARGA DE VALORES GENERALES
                const emisionEjecuionDTO = await this.emisionEjecucionService.findById(idEmisionEjecucion) as EmisionEjecucionDTO;
                this.emisionEjecucion = emisionEjecuionDTO.emisionEjecucion;
                const emisionDefinicionDTO = await this.emisionDefinicionService.findById(this.emisionEjecucion.idEmisionDefinicion) as EmisionDefinicionDTO;
                this.emisionDefinicion = emisionDefinicionDTO.emisionDefinicion;
                this.emisionVariables = emisionDefinicionDTO.emisionVariables;
                this.emisionCuotas = emisionEjecuionDTO.emisionCuotas;
                this.emisionCalculos = emisionDefinicionDTO.emisionCalculos;
                this.emisionConceptos = emisionDefinicionDTO.emisionConceptos;
                this.emisionCuentasCorrientes = emisionDefinicionDTO.emisionCuentasCorrientes;
                this.emisionImputacionesContables = emisionDefinicionDTO.emisionImputacionesContables;
                this.procedimiento = emisionDefinicionDTO.procedimientos.find(f => f.id === this.emisionDefinicion.idProcedimiento);
                this.params = {};
                this.procedimiento.procedimientoParametros.forEach(param => {
                    const paramEmision = emisionEjecuionDTO.emisionProcedimientoParametros.find(f => f.idProcedimientoParametro === param.id);
                    this.params[param.codigo] = castDataType(paramEmision.valor, param.tipoDato);
                });
                this.variables = (await this.variableService.listByTipoTributo(this.emisionDefinicion.idTipoTributo)) as Array<Variable>;

                //filtro las variables del procedimiento usadas por la emision
                this.procedimiento.procedimientoVariables = this.procedimiento.procedimientoVariables.filter(f => this.emisionVariables.map(ev => ev.idProcedimientoVariable).includes(f.id));
                //consulta todas las colecciones compatibles con el tipo de tributo
                const coleccionesTodas = (await this.coleccionService.list(this.emisionDefinicion.idTipoTributo)) as Array<Coleccion>;
                //obtengo las ids de las colecciones usadas por el procedimiento-emision
                let idsColeccionesProcedimiento = [];
                this.procedimiento.procedimientoVariables.forEach(procedimientoVariable => {
                    const coleccion = coleccionesTodas.find(f => f.coleccionesCampo.map(c => c.id).includes(procedimientoVariable.idColeccionCampo));
                    if (coleccion) 
                        if (!idsColeccionesProcedimiento.includes(coleccion.id)) idsColeccionesProcedimiento.push(coleccion.id);
                });
                //filtro las colecciones y campos usados por el procedimiento-emision
                this.colecciones = [];
                coleccionesTodas.filter(f => idsColeccionesProcedimiento.includes(f.id))
                .forEach(coleccion => {
                    let coleccionData = new ColeccionData();
                    coleccionData.coleccion = coleccion;
                    this.procedimiento.procedimientoVariables.forEach(procedimientoVariable => {
                        const coleccionCampo = coleccion.coleccionesCampo.find(f => f.id === procedimientoVariable.idColeccionCampo);
                        if (coleccionCampo) {
                            const data: [ColeccionCampo, ProcedimientoVariable] = [coleccionCampo, procedimientoVariable];
                            coleccionData.campos.push(data);
                        }
                    });
                    if (coleccionData.campos.length > 0) this.colecciones.push(coleccionData);
                });

                //consulto por la totalidad de ejecuciones-cuenta
                const emisionEjecuionesCuentas: Array<EmisionEjecucionCuenta> = await this.emisionEjecucionCuentaService.listByEmisionEjecucion(this.emisionEjecucion.id) as Array<EmisionEjecucionCuenta>;
                if (emisionEjecuionesCuentas.length === 0) {
                    reject(new ValidationError('No hay cuotas para emitir'));
                    return;
                }
                //se elimina los calculos de ejecuciones-cuenta que hayan quedado en estado procesando desde una ejecucion anterior (si hay deberian ser pocas)
                const emisionEjecuionesCuentasProcesando: Array<EmisionEjecucionCuenta> = emisionEjecuionesCuentas.filter(f => f.idEstadoEmisionEjecucionCuenta === 261); //Procesando
                for (let i = 0; i < emisionEjecuionesCuentasProcesando.length; i++) {
                    let emisionEjecucionCuenta: EmisionEjecucionCuenta = emisionEjecuionesCuentasProcesando[i];
                    emisionEjecucionCuenta.idEstadoEmisionEjecucionCuenta = 260;
                    await this.emisionEjecucionCuentaService.modify(emisionEjecucionCuenta.id, emisionEjecucionCuenta);
                    await this.emisionEjecucionCuentaService.removeChildren(emisionEjecucionCuenta.id);
                }

                const emisionEjecuionesCuotas: Array<EmisionEjecucionCuota> = await this.emisionEjecucionCuotaService.listByEmisionEjecucion(this.emisionEjecucion.id, true) as Array<EmisionEjecucionCuota>;
                //se invierte el orden porque es una pila (para hacer el efecto FIFO)
                emisionEjecuionesCuotas.sort((a,b) => (b.numeroRecibo !== a.numeroRecibo) ? b.numeroRecibo - a.numeroRecibo : b.orden - a.orden)
                emisionEjecuionesCuotas.forEach((emisionEjecuionCuota, index) => {
                    const ultimaCuota = (index === 0 || emisionEjecuionCuota.numeroRecibo !== emisionEjecuionesCuotas[index-1].numeroRecibo);
                    const data: [EmisionCuota, EmisionEjecucionCuenta, boolean] = [emisionEjecuionCuota.emisionCuota, emisionEjecuionCuota.emisionEjecucionCuenta, ultimaCuota];
                    this.emisionResources1.push(data);
                });

                //sirve para obtener la tasa cabecera
                const emisionCuentaCorrientCabecera = this.emisionCuentasCorrientes.find(f => f.tasaCabecera);
                if (!emisionCuentaCorrientCabecera) {
                    reject(new ValidationError('Falta definir la tasa cabecera'));
                    return;
                }

                //PASO 2: CARGA DE CLASES
                const filePath = `${config.PATH.MODULES}${this.emisionDefinicion.modulo}`;
                const EmisionProcess = await import(filePath);
                
                //PASO 3: INSTANCIAS DE READER, WORKER Y WRITER
                //READER
                for (let i=0; i < this.countReaders; i++) {
                    const emisionProcedure = new EmisionProcedure(this.claseElementoService, this.tipoElementoService, this.elementoService,
                                                                  this.declaracionJuradaComercioService, this.declaracionJuradaRubroService, this.tipoRubroComercioService, this.rubroComercioService,
                                                                  this.coleccionService, this.colecciones, this.params,
                                                                  this.emisionEjecucion.id, emisionCuentaCorrientCabecera.idTasa, emisionCuentaCorrientCabecera.idSubTasa);
                    const emisionReader = new EmisionReader(`EmisionReader ${i}`, this.emisionEjecucionCuentaService, emisionProcedure, this.emisionCuotas.length);
                    this.readers.push(emisionReader);
                }
                //WORKER
                for (let i=0; i < this.countWorkers; i++) {
                    const emisionProcess = new EmisionProcess.default(this.params);
                    const emisionWorker = new EmisionWorker(`EmisionWorker ${i}`, emisionProcess, this.emisionCuotas.length);
                    this.workers.push(emisionWorker);
                }
                //WRITER
                for (let i=0; i < this.countWriters; i++) {
                    const emisionWriter = new EmisionWriter(`EmisionWriter ${i}`, this.emisionEjecucionCuentaService,
                                                            this.emisionCalculoResultadoService, this.emisionConceptoResultadoService,
                                                            this.emisionCuentaCorrienteResultadoService, this.emisionImputacionContableResultadoService, this.emisionCuotas.length);
                    this.writers.push(emisionWriter);
                }

                //PASO 4: INICIO DE PROCESO
                if (this.emisionResources1.length > 0) {
                    this.releaseProcesoGlobal = await this.mutexProcesoGlobal.acquire();
                    this.readers.forEach(reader => {
                        this.executeReader(reader);
                    });
                }

                await this.mutexProcesoGlobal.waitForUnlock();

                if (!this.canceled && !this.paused) {
                    resolve({idEmisionEjecucion})
                }
                else {
                    if (this.paused) {
                        reject(new CustomError("Ejecución pausada"));
                    }
                    else if (this.canceled) {
                        reject(new ProcessError(this.message, new Error(this.message)));
                    }
                }
            }
            catch(error) {
                this.canceled = true;
                if (this.mutexProcesoGlobal.isLocked && this.releaseProcesoGlobal) {
                    this.releaseProcesoGlobal();
                }
                reject(new ProcessError('Error ejecutando emisión', error));
            }
        });
    }

    async chekProcess() {
        return new Promise( async (resolve, reject) => {
            try {
                const emisionEjecuionDTO = await this.emisionEjecucionService.findById(this.emisionEjecucion.id) as EmisionEjecucionDTO;
                const emisionEjecucionNow = emisionEjecuionDTO.emisionEjecucion;
                if (emisionEjecucionNow.idEstadoEmisionEjecucion === EMISION_EJECUCION_STATE.PAUSADA) {
                    this.paused = true;
                }
                else if (emisionEjecucionNow.idEstadoEmisionEjecucion === EMISION_EJECUCION_STATE.CANCELADA) {
                    this.canceled = true;
                }
                this.reportBusy();
            }
            catch(error) {
                this.canceled = true;
                if (this.mutexProcesoGlobal.isLocked && this.releaseProcesoGlobal) {
                    this.releaseProcesoGlobal();
                }
                reject(new ProcessError('Error consultando estado', error));
            }
        });
    }

    reportBusy() {
        // const countReadersBusy = (this.countReaders - this.readers.filter(f => f.ready).length);
        // const countWorkersBusy = (this.countWorkers - this.workers.filter(f => f.ready).length);
        // const countWritersBusy = (this.countWriters - this.writers.filter(f => f.ready).length);
        // const report = `Report Busy (${getDateNow(true)})\n`+  
        //             `Readers: ${countReadersBusy}/${this.countReaders}\n`+
        //             `Workers: ${countWorkersBusy}/${this.countWorkers}\n`+
        //             `Writers: ${countWritersBusy}/${this.countWriters}\n`;
        // console.log(report);
    }

}