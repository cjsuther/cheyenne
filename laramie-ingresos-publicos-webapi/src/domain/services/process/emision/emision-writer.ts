import EmisionProcessor from './emision-processor';
import EmisionResource from './emision-resource';
import EmisionCalculoResultado from '../../../entities/emision-calculo-resultado';
import EmisionConceptoResultado from '../../../entities/emision-concepto-resultado';
import EmisionCuentaCorrienteResultado from '../../../entities/emision-cuenta-corriente-resultado';
import EmisionImputacionContableResultado from '../../../entities/emision-imputacion-contable-resultado';

import EmisionEjecucionCuentaService from '../../emision-ejecucion-cuenta-service';
import EmisionCalculoResultadoService from "../../emision-calculo-resultado-service";
import EmisionConceptoResultadoService from '../../emision-concepto-resultado-service';
import EmisionCuentaCorrienteResultadoService from '../../emision-cuenta-corriente-resultado-service';
import EmisionImputacionContableResultadoService from '../../emision-imputacion-contable-resultado-service';

import ProcessError from '../../../../infraestructure/sdk/error/process-error';
import { EMISION_STATE } from '../../../../infraestructure/sdk/consts/emisionState';
import { iif } from '../../../../infraestructure/sdk/utils/convert';


export default class EmisionWriter extends EmisionProcessor {

    emisionEjecucionCuentaService: EmisionEjecucionCuentaService;
    emisionCalculoResultadoService: EmisionCalculoResultadoService;
    emisionConceptoResultadoService: EmisionConceptoResultadoService;
    emisionCuentaCorrienteResultadoService: EmisionCuentaCorrienteResultadoService;
    emisionImputacionContableResultadoService: EmisionImputacionContableResultadoService;
    countCuotas: number;

    constructor(name:string, emisionEjecucionCuentaService: EmisionEjecucionCuentaService,
                emisionCalculoResultadoService: EmisionCalculoResultadoService,
                emisionConceptoResultadoService: EmisionConceptoResultadoService,
                emisionCuentaCorrienteResultadoService: EmisionCuentaCorrienteResultadoService,
                emisionImputacionContableResultadoService: EmisionImputacionContableResultadoService,
                countCuotas:number
    ) {
        super(name);
        this.emisionEjecucionCuentaService = emisionEjecucionCuentaService;
        this.emisionCalculoResultadoService = emisionCalculoResultadoService;
        this.emisionConceptoResultadoService = emisionConceptoResultadoService;
        this.emisionCuentaCorrienteResultadoService = emisionCuentaCorrienteResultadoService;
        this.emisionImputacionContableResultadoService = emisionImputacionContableResultadoService;
        this.countCuotas = countCuotas;
    }

    async doProcess(emisionResource:EmisionResource): Promise<EmisionResource> {
        return new Promise( async (resolve, reject) => {
            try {
                this.ready = false;
                if (emisionResource.state !== EMISION_STATE.WORK_SUCCESS &&
                    emisionResource.state !== EMISION_STATE.WORK_ERROR &&
                    emisionResource.state !== EMISION_STATE.READ_ERROR)
                {
                    emisionResource.error = "Estado incorrecto en escritura";
                    emisionResource.state = EMISION_STATE.WRITE_ERROR;

                    emisionResource.emisionEjecucionCuenta.idEstadoEmisionEjecucionCuenta = 264; //Error
                    emisionResource.emisionEjecucionCuenta.observacion = emisionResource.error;
                    this.emisionEjecucionCuentaService.modify(emisionResource.emisionEjecucionCuenta.id, emisionResource.emisionEjecucionCuenta)
                    .then(response => {
                        this.ready = true;
                        resolve(emisionResource);
                    })
                    .catch(error => {
                        emisionResource.error = error.message;
                        emisionResource.state = EMISION_STATE.WRITE_ERROR;
                        this.ready = true;
                        resolve(emisionResource);
                    });
                }
                else if (emisionResource.state !== EMISION_STATE.WORK_SUCCESS) {
                    emisionResource.emisionEjecucionCuenta.idEstadoEmisionEjecucionCuenta = 264; //Error
                    emisionResource.emisionEjecucionCuenta.observacion = emisionResource.error;
                    this.emisionEjecucionCuentaService.modify(emisionResource.emisionEjecucionCuenta.id, emisionResource.emisionEjecucionCuenta)
                    .then(response => {
                        this.ready = true;
                        resolve(emisionResource);
                    })
                    .catch(error => {
                        emisionResource.error = error.message;
                        emisionResource.state = EMISION_STATE.WRITE_ERROR;
                        this.ready = true;
                        resolve(emisionResource);
                    });
                }
                else {
                    let requestAdd = [];

                    let emisionesCalculoResultado = [];
                    const emisionCalculosGuardaValor = emisionResource.emisionCalculos.filter(f => f.guardaValor);
                    for (let i=0; i < emisionCalculosGuardaValor.filter(f => f.guardaValor).length; i++) {
                        const emisionCalculo = emisionCalculosGuardaValor[i];
                        let emisionCalculoResultado = new EmisionCalculoResultado();
                        emisionCalculoResultado.idEmisionCalculo = emisionCalculo.id;
                        emisionCalculoResultado.idEmisionEjecucion = emisionResource.emisionEjecucion.id;
                        emisionCalculoResultado.idEmisionEjecucionCuenta = emisionResource.emisionEjecucionCuenta.id;
                        emisionCalculoResultado.idEmisionCuota = emisionResource.emisionCuota.id;
                        emisionCalculoResultado.idEstadoEmisionCalculoResultado = 270; //Calculado
                        emisionCalculoResultado.valor = (emisionResource.results[emisionCalculo.codigo]).toString();
                        emisionCalculoResultado.observacion = '';
                        emisionesCalculoResultado.push(emisionCalculoResultado);
                    }
                    if (emisionesCalculoResultado.length > 0) {
                        requestAdd.push(this.emisionCalculoResultadoService.addBlock(emisionesCalculoResultado));
                    }

                    let emisionesConceptoResultado = [];
                    for (let i=0; i < emisionResource.emisionConceptos.length; i++) {
                        const emisionConcepto = emisionResource.emisionConceptos[i];
                        const condicion = iif(emisionResource.results[`CONCEPTO_CONDICION_${emisionConcepto.orden}`], "", true);
                        if (condicion) {
                            let emisionConceptoResultado = new EmisionConceptoResultado();
                            emisionConceptoResultado.idEmisionConcepto = emisionConcepto.id;
                            emisionConceptoResultado.idEmisionEjecucion = emisionResource.emisionEjecucion.id;
                            emisionConceptoResultado.idEmisionEjecucionCuenta = emisionResource.emisionEjecucionCuenta.id;
                            emisionConceptoResultado.idEmisionCuota = emisionResource.emisionCuota.id;
                            emisionConceptoResultado.idEstadoEmisionConceptoResultado = 280; //Calculado
                            emisionConceptoResultado.valorImporteTotal = (emisionResource.results[`CONCEPTO_IMPORTE_TOTAL_${emisionConcepto.orden}`]).toString();
                            emisionConceptoResultado.valorImporteNeto = (emisionResource.results[`CONCEPTO_IMPORTE_NETO_${emisionConcepto.orden}`]).toString();
                            emisionConceptoResultado.observacion = '';
                            emisionesConceptoResultado.push(emisionConceptoResultado);
                        }
                    }
                    if (emisionesConceptoResultado.length > 0) {
                        requestAdd.push(this.emisionConceptoResultadoService.addBlock(emisionesConceptoResultado));
                    }

                    let emisionesCuentaCorrienteResultado = [];
                    for (let i=0; i < emisionResource.emisionCuentasCorrientes.length; i++) {
                        const emisionCuentaCorriente = emisionResource.emisionCuentasCorrientes[i];
                        const condicion = iif(emisionResource.results[`CUENTA_CORRIENTE_CONDICION_${emisionCuentaCorriente.orden}`], "", true);
                        if (condicion) {
                            let emisionCuentaCorrienteResultado = new EmisionCuentaCorrienteResultado();
                            emisionCuentaCorrienteResultado.idEmisionCuentaCorriente = emisionCuentaCorriente.id;
                            emisionCuentaCorrienteResultado.idEmisionEjecucion = emisionResource.emisionEjecucion.id;
                            emisionCuentaCorrienteResultado.idEmisionEjecucionCuenta = emisionResource.emisionEjecucionCuenta.id;
                            emisionCuentaCorrienteResultado.idEmisionCuota = emisionResource.emisionCuota.id;
                            emisionCuentaCorrienteResultado.idEstadoEmisionCuentaCorrienteResultado = 290; //Calculado
                            emisionCuentaCorrienteResultado.valorDebe = (emisionResource.results[`CUENTA_CORRIENTE_DEBE_${emisionCuentaCorriente.orden}`]).toString();
                            emisionCuentaCorrienteResultado.valorHaber = (emisionResource.results[`CUENTA_CORRIENTE_HABER_${emisionCuentaCorriente.orden}`]).toString();
                            emisionCuentaCorrienteResultado.observacion = '';
                            emisionesCuentaCorrienteResultado.push(emisionCuentaCorrienteResultado);
                        }
                    }
                    if (emisionesCuentaCorrienteResultado.length > 0) {
                        requestAdd.push(this.emisionCuentaCorrienteResultadoService.addBlock(emisionesCuentaCorrienteResultado));
                    }

                    let emisionesImputacionContableResultado = [];
                    for (let i=0; i < emisionResource.emisionImputacionesContables.length; i++) {
                        const emisionImputacionContable = emisionResource.emisionImputacionesContables[i];
                        const condicion = iif(emisionResource.results[`IMPUTACION_CONTABLE_CONDICION_${emisionImputacionContable.orden}`], "", true);
                        if (condicion) {
                            let emisionImputacionContableResultado = new EmisionImputacionContableResultado();
                            emisionImputacionContableResultado.idEmisionImputacionContable = emisionImputacionContable.id;
                            emisionImputacionContableResultado.idEmisionEjecucion = emisionResource.emisionEjecucion.id;
                            emisionImputacionContableResultado.idEmisionEjecucionCuenta = emisionResource.emisionEjecucionCuenta.id;
                            emisionImputacionContableResultado.idEmisionCuota = emisionResource.emisionCuota.id;
                            emisionImputacionContableResultado.idEstadoEmisionImputacionContableResultado = 300; //Calculado
                            emisionImputacionContableResultado.valorPorcentaje = (emisionResource.results[`IMPUTACION_CONTABLE_PORCENTAJE_${emisionImputacionContable.orden}`]).toString();
                            emisionImputacionContableResultado.observacion = '';
                            emisionesImputacionContableResultado.push(emisionImputacionContableResultado);
                        }
                    }
                    if (emisionesImputacionContableResultado.length > 0) {
                        requestAdd.push(this.emisionImputacionContableResultadoService.addBlock(emisionesImputacionContableResultado));
                    }

                    Promise.all(requestAdd)
                    .then(responses => {
                        emisionResource.error = "";
                        emisionResource.state = EMISION_STATE.WRITE_SUCCESS;
                        //finalizo la cuenta si es la ultima cuota
                        if (emisionResource.emisionEjecucionCuenta.idEstadoEmisionEjecucionCuenta !== 264 && emisionResource.ultimaCuota) { //distinto de Error
                            emisionResource.emisionEjecucionCuenta.idEstadoEmisionEjecucionCuenta = 262; //Finalizada
                            emisionResource.emisionEjecucionCuenta.observacion = '';
                            this.emisionEjecucionCuentaService.modify(emisionResource.emisionEjecucionCuenta.id, emisionResource.emisionEjecucionCuenta)
                            .then(response => {
                                this.ready = true;
                                resolve(emisionResource);
                            })
                            .catch(error => {
                                emisionResource.error = error.message;
                                emisionResource.state = EMISION_STATE.WRITE_ERROR;
                                this.ready = true;
                                resolve(emisionResource);
                            });
                        }
                        else {
                            //hubo error en ejecucion anterior, guardo los calculos pero no actualizo exito en la cuenta
                            this.ready = true;
                            resolve(emisionResource);
                        }
                    })
                    .catch(error => {
                        emisionResource.error = error.message;
                        emisionResource.state = EMISION_STATE.WRITE_ERROR;
                        
                        emisionResource.emisionEjecucionCuenta.idEstadoEmisionEjecucionCuenta = 264; //Error
                        emisionResource.emisionEjecucionCuenta.observacion = emisionResource.error;
                        this.emisionEjecucionCuentaService.modify(emisionResource.emisionEjecucionCuenta.id, emisionResource.emisionEjecucionCuenta)
                        .then(response => {
                            this.ready = true;
                            resolve(emisionResource);
                        })
                        .catch(error => {
                            emisionResource.error = error.message;
                            emisionResource.state = EMISION_STATE.WRITE_ERROR;
                            this.ready = true;
                            resolve(emisionResource);
                        });
                    });
                }
            }
            catch(error) {
                this.ready = true;
                reject(new ProcessError('Error grabando datos', error));
            }
        });
    }

}
