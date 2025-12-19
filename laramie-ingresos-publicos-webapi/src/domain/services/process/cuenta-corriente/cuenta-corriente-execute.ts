import ConfiguracionService from '../../configuracion-service';
import NumeracionService from '../../numeracion-service';
import TipoMovimientoService from '../../tipo-movimiento-service';
import EmisionDefinicionService from "../../emision-definicion-service";
import EmisionEjecucionService from '../../emision-ejecucion-service';
import EmisionEjecucionCuentaService from "../../emision-ejecucion-cuenta-service";
import EmisionEjecucionCuotaService from "../../emision-ejecucion-cuota-service";
import EmisionCuentaCorrienteResultadoService from "../../emision-cuenta-corriente-resultado-service";
import EmisionConceptoResultadoService from '../../emision-concepto-resultado-service';
import EmisionImputacionContableResultadoService from "../../emision-imputacion-contable-resultado-service";
import CuentaCorrienteItemService from '../../cuenta-corriente-item-service';
import CuotaPorcentajeService from '../../cuota-porcentaje-service';
import CuentaPagoService from '../../cuenta-pago-service';
import CuentaPagoItemService from '../../cuenta-pago-item-service';
import TasaVencimientoService from "../../tasa-vencimiento-service";
import DebitoAutomaticoService from '../../debito-automatico-service';
import TipoCondicionEspecialService from '../../tipo-condicion-especial-service';
import CuentaCorrienteCondicionEspecialService from '../../cuenta-corriente-condicion-especial-service';

import Configuracion from '../../../entities/configuracion';
import EmisionDefinicionDTO from "../../../dto/emision-definicion-dto";
import EmisionEjecucionDTO from "../../../dto/emision-ejecucion-dto";
import EmisionDefinicion from "../../../entities/emision-definicion";
import EmisionEjecucion from '../../../entities/emision-ejecucion';
import EmisionEjecucionCuenta from "../../../entities/emision-ejecucion-cuenta";
import EmisionEjecucionCuota from "../../../entities/emision-ejecucion-cuota";
import EmisionCuentaCorriente from "../../../entities/emision-cuenta-corriente";
import EmisionConcepto from "../../../entities/emision-concepto";
import EmisionImputacionContable from "../../../entities/emision-imputacion-contable";
import EmisionCuentaCorrienteResultado from "../../../entities/emision-cuenta-corriente-resultado";
import EmisionConceptoResultado from "../../../entities/emision-concepto-resultado";
import EmisionImputacionContableResultado from "../../../entities/emision-imputacion-contable-resultado";
import CuentaCorrienteItem from "../../../entities/cuenta-corriente-item";
import CuotaPorcentaje from "../../../entities/cuota-porcentaje";
import CuentaPago from "../../../entities/cuenta-pago";
import CuentaPagoItem from "../../../entities/cuenta-pago-item";
import TasaVencimiento from "../../../entities/tasa-vencimiento";

import ProcessError from '../../../../infraestructure/sdk/error/process-error';
import ValidationError from "../../../../infraestructure/sdk/error/validation-error";
import EmisionCuota from "../../../entities/emision-cuota";
import { getDateNow, truncateTime } from "../../../../infraestructure/sdk/utils/convert";
import { EMISION_PROCESS } from "../../../../infraestructure/sdk/consts/emisionProcess";
import Numeracion from '../../../entities/numeracion';
import CuentaCorrienteCondicionEspecial from '../../../entities/cuenta-corriente-condicion-especial';
import TipoCondicionEspecial from '../../../entities/tipo-condicion-especial';
import DebitoAutomatico from '../../../entities/debito-automatico';
import { CloneObject, addArray, distinctArray } from '../../../../infraestructure/sdk/utils/helper';
import TipoMovimiento from '../../../entities/tipo-movimiento';
import EmisionEjecucionCuentaDTO from '../../../dto/emision-ejecucion-cuenta-dto';
import EmisionEjecucionCuotaState from '../../../dto/emision-ejecucion-cuota-state';

export default class CuentaCorrienteExecute {

    idUsuarioRegistro: number;
    fechaRegistro: Date = null;

    configuracionService: ConfiguracionService;
    numeracionService: NumeracionService;
    tipoMovimientoService: TipoMovimientoService;
    emisionDefinicionService: EmisionDefinicionService;
    emisionEjecucionService: EmisionEjecucionService;
    emisionEjecucionCuentaService: EmisionEjecucionCuentaService;
    emisionEjecucionCuotaService: EmisionEjecucionCuotaService;
    emisionCuentaCorrienteResultadoService: EmisionCuentaCorrienteResultadoService;
    emisionConceptoResultadoService: EmisionConceptoResultadoService;
    emisionImputacionContableResultadoService: EmisionImputacionContableResultadoService;

    cuentaCorrienteItemService: CuentaCorrienteItemService;
	cuotaPorcentajeService: CuotaPorcentajeService;
	cuentaPagoService: CuentaPagoService;
	cuentaPagoItemService: CuentaPagoItemService;
    tasaVencimientoService: TasaVencimientoService;
    debitoAutomaticoService: DebitoAutomaticoService;
    tipoCondicionEspecialService: TipoCondicionEspecialService;
    cuentaCorrienteCondicionEspecialService: CuentaCorrienteCondicionEspecialService;

    ejecucion: EmisionEjecucion = null;
    definicion: EmisionDefinicion = null;
    emisionEjecucionCuentas: Array<EmisionEjecucionCuenta> = [];
    emisionEjecucionCuotas: Array<EmisionEjecucionCuota> = [];
    emisionCuotas: Array<EmisionCuota> = [];
    emisionConceptos: Array<EmisionConcepto> = [];
    emisionCuentasCorrientes: Array<EmisionCuentaCorriente> = [];
    emisionImputacionesContables: Array<EmisionImputacionContable> = [];

    partidas: Array<any> = [];


	constructor(configuracionService: ConfiguracionService,
                numeracionService: NumeracionService,
                tipoMovimientoService: TipoMovimientoService,
                emisionDefinicionService: EmisionDefinicionService,
                emisionEjecucionService: EmisionEjecucionService,
                emisionEjecucionCuentaService: EmisionEjecucionCuentaService,
                emisionEjecucionCuotaService: EmisionEjecucionCuotaService,
                emisionCuentaCorrienteResultadoService: EmisionCuentaCorrienteResultadoService,
                emisionConceptoResultadoService: EmisionConceptoResultadoService,
                emisionImputacionContableResultadoService: EmisionImputacionContableResultadoService,
                cuentaCorrienteItemService: CuentaCorrienteItemService, cuotaPorcentajeService: CuotaPorcentajeService,
				cuentaPagoService: CuentaPagoService, cuentaPagoItemService: CuentaPagoItemService,
                tasaVencimientoService: TasaVencimientoService,
                debitoAutomaticoService: DebitoAutomaticoService,
                tipoCondicionEspecialService: TipoCondicionEspecialService,
                cuentaCorrienteCondicionEspecialService: CuentaCorrienteCondicionEspecialService) {
        this.configuracionService = configuracionService;
        this.numeracionService = numeracionService;
        this.tipoMovimientoService = tipoMovimientoService;
		this.emisionDefinicionService = emisionDefinicionService;
        this.emisionEjecucionService = emisionEjecucionService;
        this.emisionEjecucionCuentaService = emisionEjecucionCuentaService;
        this.emisionEjecucionCuotaService = emisionEjecucionCuotaService;
        this.emisionCuentaCorrienteResultadoService = emisionCuentaCorrienteResultadoService;
        this.emisionConceptoResultadoService = emisionConceptoResultadoService;
        this.emisionImputacionContableResultadoService = emisionImputacionContableResultadoService;
        this.cuentaCorrienteItemService = cuentaCorrienteItemService;
		this.cuotaPorcentajeService = cuotaPorcentajeService;
		this.cuentaPagoService = cuentaPagoService;
		this.cuentaPagoItemService = cuentaPagoItemService;
        this.tasaVencimientoService = tasaVencimientoService;
        this.debitoAutomaticoService = debitoAutomaticoService;
        this.tipoCondicionEspecialService = tipoCondicionEspecialService;
        this.cuentaCorrienteCondicionEspecialService = cuentaCorrienteCondicionEspecialService;
	}


    sortCuentaCorrienteResultados = (a,b) => {
        if (a.idEmisionEjecucionCuenta !== b.idEmisionEjecucionCuenta)
            return a.idEmisionEjecucionCuenta - b.idEmisionEjecucionCuenta;
        else if (a.idEmisionCuota !== b.idEmisionCuota)
            return a.idEmisionCuota - b.idEmisionCuota;
        else
            return a.idEmisionCuentaCorriente - b.idEmisionCuentaCorriente;
    }

    sortConceptoResultados = (a,b) => {
        if (a.idEmisionEjecucionCuenta !== b.idEmisionEjecucionCuenta)
            return a.idEmisionEjecucionCuenta - b.idEmisionEjecucionCuenta;
        else if (a.idEmisionCuota !== b.idEmisionCuota)
            return a.idEmisionCuota - b.idEmisionCuota;
        else
            return a.idEmisionConcepto - b.idEmisionConcepto;
    }

    sortImputacionContableResultados = (a,b) => {
        if (a.idEmisionEjecucionCuenta !== b.idEmisionEjecucionCuenta)
            return a.idEmisionEjecucionCuenta - b.idEmisionEjecucionCuenta;
        else if (a.idEmisionCuota !== b.idEmisionCuota)
            return a.idEmisionCuota - b.idEmisionCuota;
        else
            return a.idEmisionImputacionContable - b.idEmisionImputacionContable;
    }

    sortEjecucionCuentaCuota = (a,b) => {
        if (a.idEmisionEjecucionCuenta !== b.idEmisionEjecucionCuenta)
            return a.idEmisionEjecucionCuenta - b.idEmisionEjecucionCuenta;
        else
            return a.idEmisionCuota - b.idEmisionCuota;
    }


    async execute(idUsuario: number, idEmisionEjecucion:number) {
        return new Promise( async (resolve, reject) => {
            try {
                this.idUsuarioRegistro = idUsuario;
                this.fechaRegistro = new Date();

                const ejecucionDTO = await this.emisionEjecucionService.findById(idEmisionEjecucion) as EmisionEjecucionDTO;
                const definicionDTO = await this.emisionDefinicionService.findById(ejecucionDTO.emisionDefinicion.id) as EmisionDefinicionDTO;
                this.emisionEjecucionCuentas = (await this.emisionEjecucionCuentaService.listByEmisionEjecucion(idEmisionEjecucion) as Array<EmisionEjecucionCuenta>).sort((a,b) => a.id-b.id);
                this.emisionEjecucionCuotas = (await this.emisionEjecucionCuotaService.listByEmisionEjecucion(idEmisionEjecucion) as Array<EmisionEjecucionCuota>).sort(this.sortEjecucionCuentaCuota);

                this.ejecucion = ejecucionDTO.emisionEjecucion as EmisionEjecucion;
                this.definicion = definicionDTO.emisionDefinicion as EmisionDefinicion;
                this.emisionCuotas = (ejecucionDTO.emisionCuotas as Array<EmisionCuota>);
                this.emisionConceptos = (definicionDTO.emisionConceptos as Array<EmisionConcepto>);
                this.emisionCuentasCorrientes = (definicionDTO.emisionCuentasCorrientes as Array<EmisionCuentaCorriente>);
                this.emisionImputacionesContables = (definicionDTO.emisionImputacionesContables as Array<EmisionImputacionContable>);
                //normalizo el orden para utilizarlo en el campo item
                let ordenNormalizado = 1;
                this.emisionConceptos.sort((a,b) => a.orden-b.orden).forEach(row => row.orden = ordenNormalizado++);
                ordenNormalizado = 1;
                this.emisionCuentasCorrientes.sort((a,b) => a.orden-b.orden).forEach(row => row.orden = ordenNormalizado++);
                //ordeno por id como lo necesita el proceso
                this.emisionCuotas.sort((a,b) => a.id-b.id);
                this.emisionConceptos.sort((a,b) => a.id-b.id);
                this.emisionCuentasCorrientes.sort((a,b) => a.id-b.id);
                this.emisionImputacionesContables.sort((a,b) => a.id-b.id);
                //obtengo sub tasa cabecera
                const emisionCuentaCorrienteCabecera = this.emisionCuentasCorrientes.find(f => f.tasaCabecera);
                const idSubTasaCabecera = (emisionCuentaCorrienteCabecera) ? emisionCuentaCorrienteCabecera.idSubTasa : 0;

                const emisionProcesosTributo:string = (await this.configuracionService.findByNombre(`EmisionProcesosTributo${this.definicion.idTipoTributo}`) as Configuracion).valor;
                const emisionProcesos = emisionProcesosTributo.split('|');

                let numeracionPartida = await this.numeracionService.findByNombre("CuentaCorrientePartida") as Numeracion;
                let numeroPartidaProximo = numeracionPartida.valorProximo;
                const cantidadPartidasReservadas = (this.ejecucion.calculoPagoAnticipado) ? this.emisionEjecucionCuentas.length : this.emisionEjecucionCuotas.length;
                numeracionPartida.valorProximo = numeracionPartida.valorProximo += cantidadPartidasReservadas;
                await this.numeracionService.modifyByNombre("CuentaCorrientePartida", numeracionPartida);
                
                let idEmisionEjecucionCuenta = 0;
                this.partidas = this.emisionEjecucionCuotas.map(ejecucionCuota => {
                    if (idEmisionEjecucionCuenta > 0) {
                        if (idEmisionEjecucionCuenta !== ejecucionCuota.idEmisionEjecucionCuenta || !this.ejecucion.calculoPagoAnticipado) {
                            numeroPartidaProximo++;
                        }
                    }
                    const partida = {
                        idEmisionEjecucionCuenta: ejecucionCuota.idEmisionEjecucionCuenta,
                        idEmisionCuota: ejecucionCuota.idEmisionCuota,
                        numeroPartida: numeroPartidaProximo
                    }
                    idEmisionEjecucionCuenta = ejecucionCuota.idEmisionEjecucionCuenta;
                    return partida;
                });

                //ejecuion de procesos
                if (emisionProcesos.includes(EMISION_PROCESS.TASA_VENCIMIENTO.toString()) && this.ejecucion.calculoMasivo){
                    await this.executeTasaVencimiento(idEmisionEjecucion);
                }
                if (emisionProcesos.includes(EMISION_PROCESS.CONCEPTO.toString()) && this.ejecucion.calculoMasivo){
                    await this.executeConcepto(idEmisionEjecucion);
                }
                if (emisionProcesos.includes(EMISION_PROCESS.CUENTA_CORRIENTE.toString()) && !this.ejecucion.calculoPagoAnticipado){
                    await this.executeCuentaCorriente(idEmisionEjecucion, idSubTasaCabecera);
                }
                if (emisionProcesos.includes(EMISION_PROCESS.IMPUTACION_CONTABLE.toString())){
                    await this.executeImputacionContable(idEmisionEjecucion);
                }
                if (emisionProcesos.includes(EMISION_PROCESS.PUBLICACION_DEUDA.toString()) && this.ejecucion.calculoMasivo){
                    await this.executePublicacionDeuda(idEmisionEjecucion);
                }

                resolve(idEmisionEjecucion);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos de cuenta corriente', error));
            }
        });
    }

    async executePagoAnticipado(idUsuario: number, idCuentaPago:number) {
        return new Promise( async (resolve, reject) => {
            try {
                this.idUsuarioRegistro = idUsuario;
                this.fechaRegistro = new Date();

                const cuentaPagoItems = await this.cuentaPagoItemService.listByCuentaPago(idCuentaPago) as Array<CuentaPagoItem>;
                if (cuentaPagoItems.length === 0) {
                    reject(new ValidationError('No se pudo obtener el detalle del pago'));
                    return;
                }
                const cuentaPagoItem = cuentaPagoItems[0]; //tomo el primer item (todos comparten los mismos datos generales en una pago anticipado)

                const ejecucionDTO = await this.emisionEjecucionService.findById(cuentaPagoItem.idEmisionEjecucion) as EmisionEjecucionDTO;
                const definicionDTO = await this.emisionDefinicionService.findById(ejecucionDTO.emisionDefinicion.id) as EmisionDefinicionDTO;
                const ejecucionCuentaDTO = await this.emisionEjecucionCuentaService.findByCuenta(cuentaPagoItem.idEmisionEjecucion, cuentaPagoItem.idCuenta) as EmisionEjecucionCuentaDTO;
                this.emisionEjecucionCuentas = [ejecucionCuentaDTO.emisionEjecucionCuenta];
                this.emisionEjecucionCuotas = (await this.emisionEjecucionCuotaService.listByEmisionEjecucionCuenta(ejecucionCuentaDTO.emisionEjecucionCuenta.id) as Array<EmisionEjecucionCuotaState>).sort(this.sortEjecucionCuentaCuota);

                this.ejecucion = ejecucionDTO.emisionEjecucion as EmisionEjecucion;
                this.definicion = definicionDTO.emisionDefinicion as EmisionDefinicion;
                this.emisionCuotas = (ejecucionDTO.emisionCuotas as Array<EmisionCuota>);
                this.emisionConceptos = (definicionDTO.emisionConceptos as Array<EmisionConcepto>);
                this.emisionCuentasCorrientes = (definicionDTO.emisionCuentasCorrientes as Array<EmisionCuentaCorriente>);
                this.emisionImputacionesContables = (definicionDTO.emisionImputacionesContables as Array<EmisionImputacionContable>);
                //normalizo el orden para utilizarlo en el campo item
                let ordenNormalizado = 1;
                this.emisionCuentasCorrientes.sort((a,b) => a.orden-b.orden).forEach(row => row.orden = ordenNormalizado++);
                //ordeno por id como lo necesita el proceso
                this.emisionCuotas.sort((a,b) => a.id-b.id);
                this.emisionCuentasCorrientes.sort((a,b) => a.id-b.id);
                //obtengo sub tasa cabecera
                const emisionCuentaCorrienteCabecera = this.emisionCuentasCorrientes.find(f => f.tasaCabecera);
                const idTasaCabecera = (emisionCuentaCorrienteCabecera) ? emisionCuentaCorrienteCabecera.idTasa : 0;
                const idSubTasaCabecera = (emisionCuentaCorrienteCabecera) ? emisionCuentaCorrienteCabecera.idSubTasa : 0;

                this.partidas = this.emisionEjecucionCuotas.map(ejecucionCuota => {
                    const partida = {
                        idEmisionEjecucionCuenta: ejecucionCuota.idEmisionEjecucionCuenta,
                        idEmisionCuota: ejecucionCuota.idEmisionCuota,
                        numeroPartida: cuentaPagoItem.numeroPartida
                    }
                    return partida;
                });

                //consulto tasa ya emitida para esta cuota
                for (let c = 0; c < this.emisionCuotas.length; c++) {
                    const cuota = this.emisionCuotas[c];
                    const items = await this.cuentaCorrienteItemService.listByTasa(idTasaCabecera, idSubTasaCabecera, this.ejecucion.periodo, parseInt(cuota.cuota), cuentaPagoItem.idCuenta) as Array<CuentaCorrienteItem>;
                    if (items.length > 0) {
                        let cuentaPagoItemsXCuota = cuentaPagoItems.filter(f => f.periodo === this.ejecucion.periodo && f.cuota === parseInt(cuota.cuota));
                        //actualizo las partidas a las registros preexistentes
                        for (let i = 0; i < cuentaPagoItemsXCuota.length; i++) {
                            let cuentaPagoItem = cuentaPagoItemsXCuota[i];
                            cuentaPagoItem.numeroPartida = items[0].numeroPartida;
                            await this.cuentaPagoItemService.modify(cuentaPagoItem.id, cuentaPagoItem);
                        }
                        //marco la cuota como ya emitida (solo en memoria)
                        let ejecucionCuota = this.emisionEjecucionCuotas.find(f => f.idEmisionCuota === cuota.id) as EmisionEjecucionCuotaState;
                        ejecucionCuota.state = "m";
                    }
                }

                this.executeCuentaCorriente(cuentaPagoItem.idEmisionEjecucion, idSubTasaCabecera, ejecucionCuentaDTO.emisionEjecucionCuenta.id)
                .then(resolve).catch(reject);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos de cuenta corriente', error));
            }
        });
    }


    async executeTasaVencimiento(idEmisionEjecucion:number) {
        return new Promise( async (resolve, reject) => {
            try {
                //array de tasas y subtasas
                let tasas = this.emisionConceptos.map(x => {
                    return {idTasa: x.idTasa, idSubTasa: x.idSubTasa};
                });
                tasas = tasas.concat(this.emisionCuentasCorrientes.map(x => {
                    return {idTasa: x.idTasa, idSubTasa: x.idSubTasa};
                }));
                tasas = tasas.concat(this.emisionImputacionesContables.map(x => {
                    return {idTasa: x.idTasa, idSubTasa: x.idSubTasa};
                }));
                //quito repetidos
                const distinctTasas = [];
                const mapTasas = new Map();
                for (const tasa of tasas) {
                    if(!mapTasas.has(`${tasa.idTasa}-${tasa.idSubTasa}`)){
                        mapTasas.set(`${tasa.idTasa}-${tasa.idSubTasa}`, tasa);
                        distinctTasas.push(tasa);
                    }
                }
                //armo array de tasa-vencimientos
                let rows = [];
                distinctTasas.forEach(tasa => {
                    this.emisionCuotas.forEach(cuota => {

                        let row = new TasaVencimiento(
                            null, //id
                            tasa.idTasa,
                            tasa.idSubTasa,
                            this.ejecucion.periodo,
                            parseInt(cuota.cuota),
                            cuota.fechaVencimiento1,
                            cuota.fechaVencimiento2,
                            idEmisionEjecucion
                        );
                        rows.push(row);

                    });
                });

                await this.tasaVencimientoService.addByBloque(rows);
                resolve(idEmisionEjecucion);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos de vencimientos de tasas', error));
            }
        });
    }

    async executeConcepto(idEmisionEjecucion:number) {
        return new Promise( async (resolve, reject) => {
            try {
                let requestCabecera= [];
                let rows = [];

                const conceptoResultados = (await this.emisionConceptoResultadoService.listByEmisionEjecucion(idEmisionEjecucion) as Array<EmisionConceptoResultado>).sort(this.sortConceptoResultados);

                //CABECERA
                let indexEmisionEjecucionCuenta = 0;
                let emisionEjecucionCuenta: EmisionEjecucionCuenta = this.emisionEjecucionCuentas[indexEmisionEjecucionCuenta];
                let indexEmisionCuota = 0;
                let emisionCuota: EmisionCuota = this.emisionCuotas[indexEmisionCuota];
                this.emisionEjecucionCuotas.forEach((ejecucionCuota, index) => {

                    if (ejecucionCuota.idEmisionEjecucionCuenta != emisionEjecucionCuenta.id) {
                        //se utiliza un while por si alguna cuenta no tuvo movimientos y hay que avanzar mas de una posicion
                        while((ejecucionCuota.idEmisionEjecucionCuenta != emisionEjecucionCuenta.id)) {
                            indexEmisionEjecucionCuenta++;
                            if (this.emisionEjecucionCuentas.length === indexEmisionEjecucionCuenta) {
                                reject(new ValidationError('Inconsistencia de datos en cuentas para cabecera concepto'));
                                return;
                            }
                            emisionEjecucionCuenta = this.emisionEjecucionCuentas[indexEmisionEjecucionCuenta];
                        }
                        indexEmisionCuota = 0;
                        emisionCuota = this.emisionCuotas[indexEmisionCuota];
                    }
                    else if (ejecucionCuota.idEmisionCuota != emisionCuota.id) {
                        while((ejecucionCuota.idEmisionCuota != emisionCuota.id)) {
                            indexEmisionCuota++;
                            if (this.emisionCuotas.length === indexEmisionCuota) {
                                reject(new ValidationError('Inconsistencia de datos en cuotas para cabecera concepto'));
                                return;
                            }
                            emisionCuota = this.emisionCuotas[indexEmisionCuota];
                        }
                    }

                    if (!this.ejecucion.calculoPagoAnticipado || indexEmisionCuota === 0) {
                        let row = new CuentaPago(
                            null, //id
                            ejecucionCuota.idEmisionEjecucion,
                            null, //idPlanPago
                            emisionEjecucionCuenta.idCuenta,
                            this.definicion.codigoDelegacion,
                            ejecucionCuota.numeroRecibo,
                            this.ejecucion.periodo,
                            (!this.ejecucion.calculoPagoAnticipado) ? parseInt(emisionCuota.cuota) : 0,
                            0,
                            0,
                            emisionCuota.fechaVencimiento1,
                            emisionCuota.fechaVencimiento2,
                            ejecucionCuota.codigoBarras,
                            this.ejecucion.calculoPagoAnticipado,
                            false //reciboEspecial
                        );
                        rows.push(row);
                    }

                    if ((index > 0 && index % 50 === 0) || (index === this.emisionEjecucionCuotas.length - 1)) {
                        if (rows.length > 0) {
                            requestCabecera.push(this.cuentaPagoService.addByBloque(rows));
                            rows = [];
                        }
                    }
                });
                
                Promise.all(requestCabecera)
                .then(async responses => {
                    try {
                        let requestDetalle = [];
                        //consulto las cabeceras recien ingresadas
                        let cuentaPagos = (await this.cuentaPagoService.listByEmisionEjecucion(idEmisionEjecucion) as Array<CuentaPago>).sort((a,b) => a.id - b.id);

                        //DETALLE
                        indexEmisionEjecucionCuenta = 0;
                        emisionEjecucionCuenta = this.emisionEjecucionCuentas[indexEmisionEjecucionCuenta];
                        indexEmisionCuota = 0;
                        emisionCuota = this.emisionCuotas[indexEmisionCuota];
                        let indexCuentaPago = 0;
                        let cuentaPago: CuentaPago = cuentaPagos[indexCuentaPago];
                        let indexEmisionConcepto = 0;
                        let emisionConcepto: EmisionConcepto = this.emisionConceptos[indexEmisionConcepto];

                        for (let index=0; index < conceptoResultados.length; index++) {
                            const resultado = conceptoResultados[index];

                            if (resultado.idEmisionEjecucionCuenta != emisionEjecucionCuenta.id) {
                                //se utiliza un while por si alguna cuenta no tuvo movimientos y hay que avanzar mas de una posicion
                                while((resultado.idEmisionEjecucionCuenta != emisionEjecucionCuenta.id)) {
                                    indexEmisionEjecucionCuenta++;
                                    if (this.emisionEjecucionCuentas.length === indexEmisionEjecucionCuenta) {
                                        reject(new ValidationError('Inconsistencia de datos en cuentas para detalle concepto'));
                                        return;
                                    }
                                    emisionEjecucionCuenta = this.emisionEjecucionCuentas[indexEmisionEjecucionCuenta];
                                }
                                indexEmisionCuota = 0;
                                emisionCuota = this.emisionCuotas[indexEmisionCuota];
                                indexEmisionConcepto = 0;
                                emisionConcepto = this.emisionConceptos[indexEmisionConcepto];

                                if (index > 0) indexCuentaPago++;
                            }
                            else if (resultado.idEmisionCuota != emisionCuota.id) {
                                while((resultado.idEmisionCuota != emisionCuota.id)) {
                                    indexEmisionCuota++;
                                    if (this.emisionCuotas.length === indexEmisionCuota) {
                                        reject(new ValidationError('Inconsistencia de datos en cuotas para detalle concepto'));
                                        return;
                                    }
                                    emisionCuota = this.emisionCuotas[indexEmisionCuota];
                                }
                                indexEmisionConcepto = 0;
                                emisionConcepto = this.emisionConceptos[indexEmisionConcepto];

                                if (index > 0 && !this.ejecucion.calculoPagoAnticipado) indexCuentaPago++;
                            }
                            else if (resultado.idEmisionConcepto != emisionConcepto.id) {
                                while((resultado.idEmisionConcepto != emisionConcepto.id)) {
                                    indexEmisionConcepto++;
                                    if (this.emisionConceptos.length === indexEmisionConcepto) {
                                        reject(new ValidationError('Inconsistencia de datos en calculos para detalle concepto'));
                                        return;
                                    }
                                    emisionConcepto = this.emisionConceptos[indexEmisionConcepto];
                                }
                            }

                            const partida = this.partidas.find(f => f.idEmisionEjecucionCuenta === resultado.idEmisionEjecucionCuenta && f.idEmisionCuota === resultado.idEmisionCuota);
                            cuentaPago = cuentaPagos[indexCuentaPago];
                            if (cuentaPago.idCuenta != emisionEjecucionCuenta.idCuenta) {
                                reject(new ValidationError('Inconsistencia de datos en cuenta para cabecera concepto'));
                                return;
                            }
                            let row = new CuentaPagoItem(
                                null, //id
                                resultado.idEmisionEjecucion,
                                resultado.id, //idEmisionConceptoResultado
                                null, //idPlanPagoCuota
                                cuentaPago.id, //idCuentaPago
                                emisionEjecucionCuenta.idCuenta,
                                emisionConcepto.idTasa,
                                emisionConcepto.idSubTasa,
                                this.ejecucion.periodo,
                                parseInt(emisionCuota.cuota),
                                parseFloat(resultado.valorImporteTotal), //importeNominal = importeTotal
                                0, 0, 0, 0, 0,
                                parseFloat(resultado.valorImporteTotal),
                                parseFloat(resultado.valorImporteNeto),
                                0, //importeDescuento
                                emisionCuota.fechaVencimiento1,
                                null, //fechaCobro
                                null, //idEdesurCliente,
                                emisionConcepto.orden, //item
                                partida.numeroPartida
                            );
                            rows.push(row);

                            if (emisionConcepto.vencimiento === 1) cuentaPago.importeVencimiento1 += row.importeNeto; //en este caso aplica el neto que es el que se cancela y si es en 1 venc
                            cuentaPago.importeVencimiento2 += row.importeNeto; //en este caso aplica el neto que es el que se cancela

                            if ((index > 0 && index % 50 === 0) || (index === conceptoResultados.length - 1)) {
                                requestDetalle.push(this.cuentaPagoItemService.addByBloque(rows));
                                rows = [];
                            }
                        }

                        const requestCabeceraUpdate = cuentaPagos.map(cuentaPago => this.cuentaPagoService.modify(cuentaPago.id, cuentaPago));

                        Promise.all(requestCabeceraUpdate.concat(requestDetalle))
                        .then(responses => {
                            resolve(idEmisionEjecucion);
                        })
                        .catch(reject);

                    }
                    catch(error) {
                        reject(new ProcessError('Error procesando datos de conceptos', error));
                    }
                })
                .catch(reject);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos de conceptos', error));
            }
        });
    }

    async executeCuentaCorriente(idEmisionEjecucion:number, idSubTasaCabecera:number, idEmisionEjecucionCuenta:number = null) {
        return new Promise( async (resolve, reject) => {
            try {
                const today = getDateNow(false);
                //consulto condiciones especiales de debitos automaticos
                const TipoCondicionEspecial_CodigoDebitoAutomatico:string = (await this.configuracionService.findByNombre("TipoCondicionEspecialCodigoDebitoAutomatico") as Configuracion).valor;
                const tipoCondicionEspecialDebitoAutomatico = await this.tipoCondicionEspecialService.findByCodigo(TipoCondicionEspecial_CodigoDebitoAutomatico) as TipoCondicionEspecial;
                //debitos automaticos para la sub tasa cabecera
                const debitosAutomaticosActivos = (await this.debitoAutomaticoService.listBySubTasa(idSubTasaCabecera) as Array<DebitoAutomatico>)
                                                    .filter(f => f.fechaAlta.getTime() <= today.getTime() && (f.fechaBaja === null || f.fechaBaja.getTime() >= today.getTime()));
                const idsCuentasDebitoAutomatico = distinctArray(debitosAutomaticosActivos.map(x => x.idCuenta)).sort((a, b) => a - b);

                let request = [];
                let rows = [];

                let cuentaCorrienteResultados = [];
                if (idEmisionEjecucionCuenta)
                    cuentaCorrienteResultados = (await this.emisionCuentaCorrienteResultadoService.listByEmisionEjecucionCuenta(idEmisionEjecucionCuenta) as Array<EmisionCuentaCorrienteResultado>).sort(this.sortCuentaCorrienteResultados);
                else
                    cuentaCorrienteResultados = (await this.emisionCuentaCorrienteResultadoService.listByEmisionEjecucion(idEmisionEjecucion) as Array<EmisionCuentaCorrienteResultado>).sort(this.sortCuentaCorrienteResultados);

                if (cuentaCorrienteResultados.length > 0) {
                    let indexEmisionEjecucionCuenta = 0;
                    let emisionEjecucionCuenta: EmisionEjecucionCuenta = this.emisionEjecucionCuentas[indexEmisionEjecucionCuenta];
                    let indexEmisionCuota = 0;
                    let emisionCuota: EmisionCuota = this.emisionCuotas[indexEmisionCuota];
                    let indexEmisionCuentaCorriente = 0;
                    let emisionCuentaCorriente: EmisionCuentaCorriente = this.emisionCuentasCorrientes[indexEmisionCuentaCorriente];
                    const idTipoMovimientoCodigo20:number = (await this.tipoMovimientoService.findByCodigo('20') as TipoMovimiento).id; //DEBITO POR RELIQUIDACION
                    const idTipoMovimientoCodigo21:number = (await this.tipoMovimientoService.findByCodigo('21') as TipoMovimiento).id; //CREDITO POR RELIQUIDACION

                    let ultimoNumeroPartida = 0;
                    let numeroItem = 1;
                    let subTasasReliquidadas = [];
                    for (let index = 0; index < cuentaCorrienteResultados.length; index++) {
                        const resultado = cuentaCorrienteResultados[index] as EmisionCuentaCorrienteResultado;

                        if (resultado.idEmisionEjecucionCuenta != emisionEjecucionCuenta.id) {
                            //se utiliza un while por si alguna cuenta no tuvo movimientos y hay que avanzar mas de una posicion
                            while((resultado.idEmisionEjecucionCuenta != emisionEjecucionCuenta.id)) {
                                indexEmisionEjecucionCuenta++;
                                if (this.emisionEjecucionCuentas.length === indexEmisionEjecucionCuenta) {
                                    reject(new ValidationError('Inconsistencia de datos en cuentas para cuenta corriente'));
                                    return;
                                }
                                emisionEjecucionCuenta = this.emisionEjecucionCuentas[indexEmisionEjecucionCuenta];
                            }
                            indexEmisionCuota = 0;
                            emisionCuota = this.emisionCuotas[indexEmisionCuota];
                            indexEmisionCuentaCorriente = 0;
                            emisionCuentaCorriente = this.emisionCuentasCorrientes[indexEmisionCuentaCorriente];

                            subTasasReliquidadas = [];
                            numeroItem = 1;
                        }
                        else if (resultado.idEmisionCuota != emisionCuota.id) {
                            while((resultado.idEmisionCuota != emisionCuota.id)) {
                                indexEmisionCuota++;
                                if (this.emisionCuotas.length === indexEmisionCuota) {
                                    reject(new ValidationError('Inconsistencia de datos en cuotas para cuenta corriente'));
                                    return;
                                }
                                emisionCuota = this.emisionCuotas[indexEmisionCuota];
                            }
                            indexEmisionCuentaCorriente = 0;
                            emisionCuentaCorriente = this.emisionCuentasCorrientes[indexEmisionCuentaCorriente];

                            subTasasReliquidadas = [];
                            if (this.ejecucion.calculoPagoAnticipado) {
                                numeroItem++;
                            }
                            else {
                                numeroItem = 1;
                            }
                        }
                        else if (resultado.idEmisionCuentaCorriente != emisionCuentaCorriente.id) {
                            while((resultado.idEmisionCuentaCorriente != emisionCuentaCorriente.id)) {
                                indexEmisionCuentaCorriente++;
                                if (this.emisionCuentasCorrientes.length === indexEmisionCuentaCorriente) {
                                    reject(new ValidationError('Inconsistencia de datos en calculos para cuenta corriente'));
                                    return;
                                }
                                emisionCuentaCorriente = this.emisionCuentasCorrientes[indexEmisionCuentaCorriente];
                            }
                            numeroItem++;
                        }

                        const emisionEjecucionCuota = this.emisionEjecucionCuotas.find(f => f.idEmisionEjecucionCuenta === resultado.idEmisionEjecucionCuenta && f.idEmisionCuota === resultado.idEmisionCuota);
                        const partida = this.partidas.find(f => f.idEmisionEjecucionCuenta === resultado.idEmisionEjecucionCuenta && f.idEmisionCuota === resultado.idEmisionCuota);
                        //si numeroRecibo es cero, es para reliquidar (acutaliza la partida)
                        if (emisionEjecucionCuota.numeroRecibo === 0) {
                            if (!subTasasReliquidadas.includes(emisionCuentaCorriente.idSubTasa)) { //la reliquidacion se hace con corte subtasa
                                const itemsActualesXCuotaSubTasa = await this.cuentaCorrienteItemService.listByTasa(emisionCuentaCorriente.idTasa, emisionCuentaCorriente.idSubTasa, this.ejecucion.periodo, parseInt(emisionCuota.cuota), emisionEjecucionCuenta.idCuenta) as Array<CuentaCorrienteItem>;
                                const idsItemsDefXSubTasa = this.emisionCuentasCorrientes.filter(f => f.idTasa === emisionCuentaCorriente.idTasa && f.idSubTasa === emisionCuentaCorriente.idSubTasa).map(x => x.id);
                                const itemsNuevosXCuotaSubTasa = cuentaCorrienteResultados.filter(f => f.idEmisionEjecucionCuenta === emisionEjecucionCuenta.id && f.idEmisionCuota === emisionCuota.id && idsItemsDefXSubTasa.includes(f.idEmisionCuentaCorriente));
                                const importeSaldoActual = addArray(itemsActualesXCuotaSubTasa.map(item => item.importeDebe - item.importeHaber));
                                const importeSaldoNuevo = addArray(itemsNuevosXCuotaSubTasa.map(item => parseFloat(item.valorDebe) - parseFloat(item.valorHaber)));
                                if (importeSaldoActual < importeSaldoNuevo) {
                                    let row = CloneObject(itemsActualesXCuotaSubTasa[0]);
                                    row.idEmisionEjecucion = resultado.idEmisionEjecucion;
                                    row.idEmisionCuentaCorrienteResultado = resultado.id;
                                    row.codigoDelegacion = this.definicion.codigoDelegacion;
                                    row.idTipoMovimiento = idTipoMovimientoCodigo20;
                                    row.numeroMovimiento = emisionEjecucionCuota.numeroRecibo;
                                    row.importeDebe = (importeSaldoNuevo - importeSaldoActual);
                                    row.importeHaber = 0;
                                    row.fechaOrigen = truncateTime(this.ejecucion.fechaEjecucionFin);
                                    row.fechaMovimiento = getDateNow(false);
                                    row.idUsuarioRegistro = this.idUsuarioRegistro;
                                    row.fechaRegistro = this.fechaRegistro;
                                    rows.push(row);
                                }
                                else if (importeSaldoActual > importeSaldoNuevo) {
                                    let row = CloneObject(itemsActualesXCuotaSubTasa[0]);
                                    row.idEmisionEjecucion = resultado.idEmisionEjecucion;
                                    row.idEmisionCuentaCorrienteResultado = resultado.id;
                                    row.codigoDelegacion = this.definicion.codigoDelegacion;
                                    row.idTipoMovimiento = idTipoMovimientoCodigo21;
                                    row.numeroMovimiento = emisionEjecucionCuota.numeroRecibo;
                                    row.importeDebe = 0;
                                    row.importeHaber = (importeSaldoActual - importeSaldoNuevo);
                                    row.fechaOrigen = truncateTime(this.ejecucion.fechaEjecucionFin);
                                    row.fechaMovimiento = getDateNow(false);
                                    row.idUsuarioRegistro = this.idUsuarioRegistro;
                                    row.fechaRegistro = this.fechaRegistro;
                                    rows.push(row);
                                }
                                subTasasReliquidadas.push(emisionCuentaCorriente.idSubTasa);
                            }
                        }
                        else {
                            if (this.ejecucion.calculoPagoAnticipado && (emisionEjecucionCuota as EmisionEjecucionCuotaState).state === "m") { //si state es m, es para actualizar la cuota con los datos del pago anticipado                            
                                const itemsActualesXCuotaSubTasa = await this.cuentaCorrienteItemService.listByTasa(emisionCuentaCorriente.idTasa, emisionCuentaCorriente.idSubTasa, this.ejecucion.periodo, parseInt(emisionCuota.cuota), emisionEjecucionCuenta.idCuenta) as Array<CuentaCorrienteItem>;
                                const idsTipoMovimiento = distinctArray(itemsActualesXCuotaSubTasa.filter(f => f.idTipoMovimiento === emisionCuentaCorriente.idTipoMovimiento).map(x => x.idTipoMovimiento));
                                if (!idsTipoMovimiento.includes(emisionCuentaCorriente.idTipoMovimiento)) {
                                    let row = CloneObject(itemsActualesXCuotaSubTasa[0]);
                                    row.idEmisionEjecucion = resultado.idEmisionEjecucion;
                                    row.idEmisionCuentaCorrienteResultado = resultado.id;
                                    row.codigoDelegacion = this.definicion.codigoDelegacion;
                                    row.idTipoMovimiento = emisionCuentaCorriente.idTipoMovimiento;
                                    row.numeroMovimiento = emisionEjecucionCuota.numeroRecibo;
                                    row.importeDebe = parseFloat(resultado.valorDebe),
                                    row.importeHaber = parseFloat(resultado.valorHaber),
                                    row.fechaOrigen = truncateTime(this.ejecucion.fechaEjecucionFin);
                                    row.fechaMovimiento = getDateNow(false);
                                    row.idUsuarioRegistro = this.idUsuarioRegistro;
                                    row.fechaRegistro = this.fechaRegistro;
                                    rows.push(row);
                                }
                            }
                            else {
                                let row = new CuentaCorrienteItem(
                                    null, //id
                                    resultado.idEmisionEjecucion,
                                    resultado.id, //idEmisionCuentaCorrienteResultado
                                    null, //idPlanPago
                                    null, //idPlanPagoCuota
                                    null, //idCertificadoApremio
                                    emisionEjecucionCuenta.idCuenta,
                                    emisionCuentaCorriente.idTasa,
                                    emisionCuentaCorriente.idSubTasa,
                                    this.ejecucion.periodo,
                                    parseInt(emisionCuota.cuota),
                                    this.definicion.codigoDelegacion,
                                    emisionCuentaCorriente.idTipoMovimiento,
                                    emisionEjecucionCuota.numeroRecibo, //numeroMovimiento
                                    partida.numeroPartida,
                                    emisionCuentaCorriente.tasaCabecera,
                                    320, //idTipoValor = Pesos
                                    parseFloat(resultado.valorDebe),
                                    parseFloat(resultado.valorHaber),
                                    null, //idLugarPago
                                    truncateTime(this.ejecucion.fechaEjecucionFin), //fechaOrigen
                                    getDateNow(false), //fechaMovimiento
                                    emisionCuota.fechaVencimiento1,
                                    emisionCuota.fechaVencimiento2,
                                    0, //cantidad,
                                    null, //idEdesurCliente,
                                    "", //detalle
                                    numeroItem, //item
                                    this.idUsuarioRegistro,
                                    this.fechaRegistro
                                );
                                rows.push(row);
        
                                if (!this.ejecucion.calculoPagoAnticipado && this.ejecucion.aplicaDebitoAutomatico) {
                                    if (ultimoNumeroPartida !== partida.numeroPartida && idsCuentasDebitoAutomatico.includes(emisionEjecucionCuenta.idCuenta)) {
                                        const condicionEspecial = new CuentaCorrienteCondicionEspecial(
                                            null, //id
                                            partida.numeroPartida,
                                            tipoCondicionEspecialDebitoAutomatico.id,
                                            emisionEjecucionCuenta.idCuenta,
                                            this.definicion.codigoDelegacion,
                                            emisionEjecucionCuota.numeroRecibo, //numeroMovimiento
                                            partida.numeroPartida,
                                            emisionEjecucionCuota.numeroRecibo, //numeroComprobante
                                            today,
                                            emisionCuota.fechaVencimiento2
                                        );
                                        request.push(this.cuentaCorrienteCondicionEspecialService.add(condicionEspecial));
                                    }
                                }
                            }
                        }

                        ultimoNumeroPartida = partida.numeroPartida;

                        if ((index > 0 && index % 50 === 0) || (index === cuentaCorrienteResultados.length - 1)) {
                            if (rows.length > 0) {
                                request.push(this.cuentaCorrienteItemService.addByBloque(rows));
                                rows = [];
                            }
                        }
                    }
                }

                Promise.all(request)
                .then(responses => {
                    resolve(idEmisionEjecucion);
                })
                .catch((error) => {
                    reject(error);
                });
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos de cuenta corriente', error));
            }
        });
    }

    async executeImputacionContable(idEmisionEjecucion:number) {
        return new Promise( async (resolve, reject) => {
            try {
                let request = [];
                let rows = [];

                const imputacionContableResultados = (await this.emisionImputacionContableResultadoService.listByEmisionEjecucion(idEmisionEjecucion) as Array<EmisionImputacionContableResultado>).sort(this.sortImputacionContableResultados);
                
                let indexEmisionEjecucionCuenta = 0;
                let emisionEjecucionCuenta: EmisionEjecucionCuenta = this.emisionEjecucionCuentas[indexEmisionEjecucionCuenta];
                let indexEmisionCuota = 0;
                let emisionCuota: EmisionCuota = this.emisionCuotas[indexEmisionCuota];
                let indexEmisionImputacionContable = 0;
                let emisionImputacionContable: EmisionImputacionContable = this.emisionImputacionesContables[indexEmisionImputacionContable];
                imputacionContableResultados.forEach((resultado, index) => {

                    if (resultado.idEmisionEjecucionCuenta != emisionEjecucionCuenta.id) {
                        //se utiliza un while por si alguna cuenta no tuvo movimientos y hay que avanzar mas de una posicion
                        while((resultado.idEmisionEjecucionCuenta != emisionEjecucionCuenta.id)) {
                            indexEmisionEjecucionCuenta++;
                            if (this.emisionEjecucionCuentas.length === indexEmisionEjecucionCuenta) {
                                reject(new ValidationError('Inconsistencia de datos en cuentas para imputación contable'));
                                return;
                            }
                            emisionEjecucionCuenta = this.emisionEjecucionCuentas[indexEmisionEjecucionCuenta];
                        }
                        indexEmisionCuota = 0;
                        emisionCuota = this.emisionCuotas[indexEmisionCuota];
                        indexEmisionImputacionContable = 0;
                        emisionImputacionContable = this.emisionImputacionesContables[indexEmisionImputacionContable];
                    }
                    else if (resultado.idEmisionCuota != emisionCuota.id) {
                        while((resultado.idEmisionCuota != emisionCuota.id)) {
                            indexEmisionCuota++;
                            if (this.emisionCuotas.length === indexEmisionCuota) {
                                reject(new ValidationError('Inconsistencia de datos en cuotas para imputación contable'));
                                return;
                            }
                            emisionCuota = this.emisionCuotas[indexEmisionCuota];
                        }
                        indexEmisionImputacionContable = 0;
                        emisionImputacionContable = this.emisionImputacionesContables[indexEmisionImputacionContable];
                    }
                    else if (resultado.idEmisionImputacionContable != emisionImputacionContable.id) {
                        while((resultado.idEmisionImputacionContable != emisionImputacionContable.id)) {
                            indexEmisionImputacionContable++;
                            if (this.emisionImputacionesContables.length === indexEmisionImputacionContable) {
                                reject(new ValidationError('Inconsistencia de datos en calculos para imputación contable'));
                                return;
                            }
                            emisionImputacionContable = this.emisionImputacionesContables[indexEmisionImputacionContable];
                        }
                    }

                    let row = new CuotaPorcentaje(
                        null, //id
                        resultado.idEmisionEjecucion,
                        resultado.id, //idEmisionImputacionContableResultado
                        emisionEjecucionCuenta.idCuenta,
                        emisionImputacionContable.idTasa,
                        emisionImputacionContable.idSubTasa,
                        this.ejecucion.periodo,
                        parseInt(emisionCuota.cuota),
                        emisionImputacionContable.idTasaPorcentaje,
                        emisionImputacionContable.idSubTasaPorcentaje,
                        parseFloat(resultado.valorPorcentaje), //porcentaje
                        0, //importePorcentaje
                        this.ejecucion.periodo //ejercicio
                    );
                    rows.push(row);

                    if ((index > 0 && index % 50 === 0) || (index === imputacionContableResultados.length - 1)) {
                        request.push(this.cuotaPorcentajeService.addByBloque(rows));
                        rows = [];
                    }
                });

                Promise.all(request)
                .then(responses => {
                    resolve(idEmisionEjecucion);
                })
                .catch((error) => {
                    reject(error);
                });
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos de imputación contable', error));
            }
        });
    }

    async executePublicacionDeuda(idEmisionEjecucion:number) {
        return new Promise( async (resolve, reject) => {
            try {
                const data = await this.emisionEjecucionCuentaService.listPublicacion(idEmisionEjecucion);


                // reject(new ValidationError('Funcionalidad en construcción'));
                resolve(idEmisionEjecucion);

            }
            catch(error) {
                reject(new ProcessError('Error procesando datos de publicación de deuda', error));
            }
        });
    }
}