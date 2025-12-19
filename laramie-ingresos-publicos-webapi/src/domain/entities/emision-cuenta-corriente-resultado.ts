export default class EmisionCuentaCorrienteResultado {

    id: number;
	idEmisionEjecucion: number;
	idEmisionEjecucionCuenta: number;
	idEmisionCuentaCorriente: number;
	idEmisionCuota: number;
	idEstadoEmisionCuentaCorrienteResultado: number;
	valorDebe: string;
	valorHaber: string;
	observacion: string;

	constructor(
        id: number = 0,
		idEmisionEjecucion: number = 0,
		idEmisionEjecucionCuenta: number = 0,
		idEmisionCuentaCorriente: number = 0,
		idEmisionCuota: number = 0,
		idEstadoEmisionCuentaCorrienteResultado: number = 0,
		valorDebe: string = "",
		valorHaber: string = "",
		observacion: string = ""
	)
	{
        this.id = id;
		this.idEmisionEjecucion = idEmisionEjecucion;
		this.idEmisionEjecucionCuenta = idEmisionEjecucionCuenta;
		this.idEmisionCuentaCorriente = idEmisionCuentaCorriente;
		this.idEmisionCuota = idEmisionCuota;
		this.idEstadoEmisionCuentaCorrienteResultado = idEstadoEmisionCuentaCorrienteResultado;
		this.valorDebe = valorDebe;
		this.valorHaber = valorHaber;
		this.observacion = observacion;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idEmisionEjecucion = row.idEmisionEjecucion ?? 0;
		this.idEmisionEjecucionCuenta = row.idEmisionEjecucionCuenta ?? 0;
		this.idEmisionCuentaCorriente = row.idEmisionCuentaCorriente ?? 0;
		this.idEmisionCuota = row.idEmisionCuota ?? 0;
		this.idEstadoEmisionCuentaCorrienteResultado = row.idEstadoEmisionCuentaCorrienteResultado ?? 0;
		this.valorDebe = row.valorDebe ?? "";
		this.valorHaber = row.valorHaber ?? "";
		this.observacion = row.observacion ?? "";
	}

}
