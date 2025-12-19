import EmisionProcessor from './emision-processor';
import Variable from '../../../entities/variable';
import EmisionResource from './emision-resource';
import EmisionEjecucionCuentaService from '../../emision-ejecucion-cuenta-service';
import ProcessError from '../../../../infraestructure/sdk/error/process-error';
import { EMISION_STATE } from '../../../../infraestructure/sdk/consts/emisionState';
import EmisionProcedure from './emision-procedure';


export default class EmisionReader extends EmisionProcessor {

    emisionEjecucionCuentaService: EmisionEjecucionCuentaService;
    emisionProcedure: EmisionProcedure;
    countCuotas: number;

    constructor(name:string, emisionEjecucionCuentaService: EmisionEjecucionCuentaService,
        emisionProcedure:EmisionProcedure, countCuotas:number) {
        super(name);
        this.emisionEjecucionCuentaService = emisionEjecucionCuentaService;
        this.emisionProcedure = emisionProcedure;
        this.countCuotas = countCuotas;
    }

    async doProcess(emisionResource:EmisionResource): Promise<EmisionResource> {
        return new Promise( async (resolve, reject) => {
            try {
                this.ready = false;
                if (emisionResource.state !== EMISION_STATE.READ_PENDING) {
                    emisionResource.variables = null;
                    emisionResource.error = "Estado incorrecto en lectura";
                    emisionResource.state = EMISION_STATE.READ_ERROR;
                    this.ready = true;
                    resolve(emisionResource);
                }
                else {
                    if (emisionResource.emisionEjecucionCuenta.idEstadoEmisionEjecucionCuenta === 260) { //solo desde pendiente
                        try {
                            emisionResource.emisionEjecucionCuenta.idEstadoEmisionEjecucionCuenta = 261; //Proceso
                            emisionResource.emisionEjecucionCuenta.observacion = '';
                            await this.emisionEjecucionCuentaService.modify(emisionResource.emisionEjecucionCuenta.id, emisionResource.emisionEjecucionCuenta)
                        }
                        catch(error){
                            emisionResource.variables = null;
                            emisionResource.error = error;
                            emisionResource.state = EMISION_STATE.READ_ERROR;
                            this.ready = true;
                            resolve(emisionResource);
                        }
                    }
                    const periodo = parseInt(emisionResource.emisionEjecucion.periodo);
                    const mes = emisionResource.emisionCuota.mes;
                    let queries = [];
                    queries.push(this.emisionProcedure.getVariablesByCuenta(emisionResource.emisionEjecucionCuenta.idCuenta, periodo, mes));
                    if (emisionResource.emisionDefinicion.procesaElementos) {
                        queries.push(this.emisionProcedure.getElementosByCuenta(emisionResource.emisionEjecucionCuenta.idCuenta, periodo, mes));
                    }
                    else {
                        queries.push(new Promise((resolve, reject) => resolve({})));
                    }
                    if (emisionResource.emisionDefinicion.procesaRubros) {
                        queries.push(this.emisionProcedure.getEntidadesByCuenta(emisionResource.emisionEjecucionCuenta.idCuenta, periodo, mes));
                    }
                    else {
                        queries.push(new Promise((resolve, reject) => resolve({})));
                    }

                    Promise.all(queries)
                    .then(datas => {
                        emisionResource.variables = datas[0];
                        emisionResource.elementos = datas[1];
                        emisionResource.entidades = datas[2];
                        emisionResource.error = "";
                        emisionResource.state = EMISION_STATE.READ_SUCCESS;
                        this.ready = true;
                        resolve(emisionResource);
                    })
                    .catch(error => {
                        emisionResource.variables = null;
                        emisionResource.error = error;
                        emisionResource.state = EMISION_STATE.READ_ERROR;
                        this.ready = true;
                        resolve(emisionResource);
                    });
                }
            }
            catch(error) {
                this.ready = true;
                reject(new ProcessError('Error leyendo datos', error));
            }
        });
    }

}
