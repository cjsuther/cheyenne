import Cuenta from "../entities/cuenta";
import EmisionEjecucionCuenta from "../entities/emision-ejecucion-cuenta";
import EmisionCuota from "../entities/emision-cuota";
import EmisionCalculo from "../entities/emision-calculo";
import EmisionConcepto from '../entities/emision-concepto';
import EmisionCuentaCorriente from '../entities/emision-cuenta-corriente';
import EmisionImputacionContable from '../entities/emision-imputacion-contable';


export default class EmisionEjecucionCuentaDTO {

    cuenta: Cuenta;
	emisionEjecucionCuenta: EmisionEjecucionCuenta;
	emisionCuotas: Array<EmisionCuota>;
	emisionCalculos: Array<EmisionCalculo>;
	emisionConceptos: Array<EmisionConcepto>;
	emisionCuentasCorrientes: Array<EmisionCuentaCorriente>;
	emisionImputacionesContables: Array<EmisionImputacionContable>;

	constructor(
        cuenta: Cuenta = new Cuenta(),
		emisionEjecucionCuenta: EmisionEjecucionCuenta = new EmisionEjecucionCuenta(),
		emisionCuotas: Array<EmisionCuota> = [],
		emisionCalculos: Array<EmisionCalculo> = [],
		emisionConceptos: Array<EmisionConcepto> = [],
		emisionCuentasCorrientes: Array<EmisionCuentaCorriente> = [],
		emisionImputacionesContables: Array<EmisionImputacionContable> = []
	)
	{
        this.cuenta = cuenta;
		this.emisionEjecucionCuenta = emisionEjecucionCuenta;
		this.emisionCuotas = emisionCuotas;
		this.emisionCalculos = emisionCalculos;
		this.emisionConceptos = emisionConceptos;
		this.emisionCuentasCorrientes = emisionCuentasCorrientes;
		this.emisionImputacionesContables = emisionImputacionesContables;
	}

	setFromObject = (row) =>
	{
		this.cuenta.setFromObject(row.cuenta);
		this.emisionEjecucionCuenta.setFromObject(row.emisionEjecucionCuenta);
		this.emisionCuotas = row.emisionCuotas.map(x => {
            let item = new EmisionCuota();
            item.setFromObject(x);
            return item;
        });
		this.emisionCalculos = row.emisionCalculos.map(x => {
            let item = new EmisionCalculo();
            item.setFromObject(x);
            return item;
        });
		this.emisionConceptos = row.emisionConceptos.map(x => {
            let item = new EmisionConcepto();
            item.setFromObject(x);
            return item;
        });
        this.emisionCuentasCorrientes = row.emisionCuentasCorrientes.map(x => {
            let item = new EmisionCuentaCorriente();
            item.setFromObject(x);
            return item;
        });
        this.emisionImputacionesContables = row.emisionImputacionesContables.map(x => {
            let item = new EmisionImputacionContable();
            item.setFromObject(x);
            return item;
        });
	}

}
