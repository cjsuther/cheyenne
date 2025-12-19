import EmisionEjecucionCuota from "./emision-ejecucion-cuota";
import EmisionCalculoResultado from "./emision-calculo-resultado";
import EmisionConceptoResultado from "./emision-concepto-resultado";
import EmisionCuentaCorrienteResultado from "./emision-cuenta-corriente-resultado";
import EmisionImputacionContableResultado from "./emision-imputacion-contable-resultado";

export default class EmisionEjecucionCuenta {

    id: number;
	idEmisionEjecucion: number;
	idCuenta: number;
	idEstadoEmisionEjecucionCuenta: number;
	numeroBloque: number;
	numero: number;
	observacion: string;
	emisionEjecucionCuotas: Array<EmisionEjecucionCuota>;
	emisionCalculosResultado: Array<EmisionCalculoResultado>;
	emisionConceptosResultado : Array<EmisionConceptoResultado>;
	emisionCuentasCorrientesResultado: Array<EmisionCuentaCorrienteResultado>;
	emisionImputacionesContablesResultado: Array<EmisionImputacionContableResultado>;

	constructor(
        id: number = 0,
		idEmisionEjecucion: number = 0,
		idCuenta: number = 0,
		idEstadoEmisionEjecucionCuenta: number = 0,
		numeroBloque: number = 0,
		numero: number = 0,
		observacion: string = "",
		emisionEjecucionCuotas: Array<EmisionEjecucionCuota> = [],
		emisionCalculosResultado: Array<EmisionCalculoResultado> = [],
		emisionConceptosResultado : Array<EmisionConceptoResultado> = [],
		emisionCuentasCorrientesResultado: Array<EmisionCuentaCorrienteResultado> = [],
		emisionImputacionesContablesResultado: Array<EmisionImputacionContableResultado> = []
	)
	{
        this.id = id;
		this.idEmisionEjecucion = idEmisionEjecucion;
		this.idCuenta = idCuenta;
		this.idEstadoEmisionEjecucionCuenta = idEstadoEmisionEjecucionCuenta;
		this.numeroBloque = numeroBloque;
		this.numero = numero;
		this.observacion = observacion;
		this.emisionEjecucionCuotas = emisionEjecucionCuotas;
		this.emisionCalculosResultado = emisionCalculosResultado;
		this.emisionConceptosResultado = emisionConceptosResultado;
		this.emisionCuentasCorrientesResultado = emisionCuentasCorrientesResultado;
		this.emisionImputacionesContablesResultado = emisionImputacionesContablesResultado;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idEmisionEjecucion = row.idEmisionEjecucion ?? 0;
		this.idCuenta = row.idCuenta ?? 0;
		this.idEstadoEmisionEjecucionCuenta = row.idEstadoEmisionEjecucionCuenta ?? 0;
		this.numeroBloque = row.numeroBloque ?? 0;
		this.numero = row.numero ?? 0;
		this.observacion = row.observacion ?? "";
		this.emisionEjecucionCuotas = row.emisionEjecucionCuotas.map(x => {
            let item = new EmisionEjecucionCuota();
            item.setFromObject(x);
            return item;
        });
		this.emisionCalculosResultado = row.emisionCalculosResultado.map(x => {
            let item = new EmisionCalculoResultado();
            item.setFromObject(x);
            return item;
        });
		this.emisionConceptosResultado = row.emisionConceptosResultado.map(x => {
            let item = new EmisionConceptoResultado();
            item.setFromObject(x);
            return item;
        });
		this.emisionCuentasCorrientesResultado = row.emisionCuentasCorrientesResultado.map(x => {
            let item = new EmisionCuentaCorrienteResultado();
            item.setFromObject(x);
            return item;
        });
		this.emisionImputacionesContablesResultado = row.emisionImputacionesContablesResultado.map(x => {
            let item = new EmisionImputacionContableResultado();
            item.setFromObject(x);
            return item;
        });
	}

}
