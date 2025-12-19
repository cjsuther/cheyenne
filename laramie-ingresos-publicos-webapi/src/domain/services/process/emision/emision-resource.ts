import EmisionDefinicion from "../../../entities/emision-definicion";
import EmisionEjecucion from "../../../entities/emision-ejecucion";
import EmisionEjecucionCuenta from "../../../entities/emision-ejecucion-cuenta";
import EmisionCalculo from "../../../entities/emision-calculo";
import EmisionConcepto from "../../../entities/emision-concepto";
import EmisionCuentaCorriente from "../../../entities/emision-cuenta-corriente";
import EmisionImputacionContable from "../../../entities/emision-imputacion-contable";
import { EMISION_STATE } from '../../../../infraestructure/sdk/consts/emisionState';
import EmisionCuota from "../../../entities/emision-cuota";


export default class EmisionResource {

    emisionDefinicion: EmisionDefinicion;
    emisionEjecucion: EmisionEjecucion;
    emisionEjecucionCuenta: EmisionEjecucionCuenta;
    emisionCuota: EmisionCuota;
    emisionCalculos: Array<EmisionCalculo>;
    emisionConceptos: Array<EmisionConcepto>;
    emisionCuentasCorrientes: Array<EmisionCuentaCorriente>;
    emisionImputacionesContables: Array<EmisionImputacionContable>;
    ultimaCuota: boolean;
    
    params:object;
    variables: object;
    elementos: object;
    entidades: object;
    results: object;
    state: string;
    error: string;

    constructor(emisionDefinicion:EmisionDefinicion, emisionEjecucion:EmisionEjecucion,
                emisionEjecucionCuenta:EmisionEjecucionCuenta, emisionCuota: EmisionCuota,
                emisionCalculos: Array<EmisionCalculo>, emisionConceptos: Array<EmisionConcepto>,
                emisionCuentasCorrientes: Array<EmisionCuentaCorriente>, emisionImputacionesContables: Array<EmisionImputacionContable>,
                params:object, ultimaCuota: boolean) {
        this.emisionDefinicion = emisionDefinicion;
        this.emisionEjecucion = emisionEjecucion;
        this.emisionEjecucionCuenta = emisionEjecucionCuenta;
        this.emisionCuota = emisionCuota;
        this.emisionCalculos = emisionCalculos;
        this.emisionConceptos = emisionConceptos;
        this.emisionCuentasCorrientes = emisionCuentasCorrientes;
        this.emisionImputacionesContables = emisionImputacionesContables;
        this.params = params;
        this.variables = null;
        this.elementos = null;
        this.entidades = null;
        this.results = null;
        this.state = EMISION_STATE.READ_PENDING;
        this.error = "";
        this.ultimaCuota = ultimaCuota;
    }

}
