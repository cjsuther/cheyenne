import EmisionProcessor from './emision-processor';
import EmisionResource from './emision-resource';
import CodeFunctions from './functions';
import ProcessError from '../../../../infraestructure/sdk/error/process-error';
import { EMISION_STATE } from '../../../../infraestructure/sdk/consts/emisionState';


export default class EmisionWorker extends EmisionProcessor {

    emisionProcess: any;
    countCuotas: number;

    constructor(name:string, emisionProcess:any, countCuotas:number) {
        super(name);
        this.emisionProcess = emisionProcess;
        this.countCuotas = countCuotas;
    }

    async doProcess(emisionResource:EmisionResource): Promise<EmisionResource> {
        return new Promise( async (resolve, reject) => {
            try {
                this.ready = false;
                if (emisionResource.state !== EMISION_STATE.READ_SUCCESS &&
                    emisionResource.state !== EMISION_STATE.READ_ERROR)
                {
                    emisionResource.results = null;
                    emisionResource.error = "Estado incorrecto en proceso";
                    emisionResource.state = EMISION_STATE.WORK_ERROR;
                    this.ready = true;
                    resolve(emisionResource);
                }
                else if (emisionResource.state !== EMISION_STATE.READ_SUCCESS) {
                    this.ready = true;
                    resolve(emisionResource);
                }
                else {
                    const data = {
                        CuotaEjecucionNumero: parseInt(emisionResource.emisionCuota.cuota),
                        CuotaEjecucionFechaVencimiento1: emisionResource.emisionCuota.fechaVencimiento1,
                        CuotaEjecucionFechaVencimiento2: emisionResource.emisionCuota.fechaVencimiento2,
                        CuotaEjecucionCantidad: this.countCuotas
                    };
                    let codeFunctions = new CodeFunctions();
                    this.emisionProcess.getResults(codeFunctions.getFunctions(data), emisionResource.variables, emisionResource.elementos, emisionResource.entidades)
                    .then(data => {
                        emisionResource.results = data;
                        emisionResource.error = "";
                        emisionResource.state = EMISION_STATE.WORK_SUCCESS;
                        this.ready = true;
                        resolve(emisionResource);
                    })
                    .catch(error => {
                        emisionResource.results = null;
                        emisionResource.error = error;
                        emisionResource.state = EMISION_STATE.WORK_ERROR;
                        this.ready = true;
                        resolve(emisionResource);
                    });
                }
            }
            catch(error) {
                this.ready = true;
                reject(new ProcessError('Error calculando datos', error));
            }
        });
    }

}
