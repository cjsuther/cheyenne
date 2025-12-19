export default class EmisionImputacionContableResultado {

    id: number;
	idEmisionEjecucion: number;
	idEmisionEjecucionCuenta: number;
	idEmisionImputacionContable: number;
	idEmisionCuota: number;
	idEstadoEmisionImputacionContableResultado: number;
	valorPorcentaje: string;
	observacion: string;

	constructor(
        id: number = 0,
		idEmisionEjecucion: number = 0,
		idEmisionEjecucionCuenta: number = 0,
		idEmisionImputacionContable: number = 0,
		idEmisionCuota: number = 0,
		idEstadoEmisionImputacionContableResultado: number = 0,
		valorPorcentaje: string = "",
		observacion: string = ""
	)
	{
        this.id = id;
		this.idEmisionEjecucion = idEmisionEjecucion;
		this.idEmisionEjecucionCuenta = idEmisionEjecucionCuenta;
		this.idEmisionImputacionContable = idEmisionImputacionContable;
		this.idEmisionCuota = idEmisionCuota;
		this.idEstadoEmisionImputacionContableResultado = idEstadoEmisionImputacionContableResultado;
		this.valorPorcentaje = valorPorcentaje;
		this.observacion = observacion;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idEmisionEjecucion = row.idEmisionEjecucion ?? 0;
		this.idEmisionEjecucionCuenta = row.idEmisionEjecucionCuenta ?? 0;
		this.idEmisionImputacionContable = row.idEmisionImputacionContable ?? 0;
		this.idEmisionCuota = row.idEmisionCuota ?? 0;
		this.idEstadoEmisionImputacionContableResultado = row.idEstadoEmisionImputacionContableResultado ?? 0;
		this.valorPorcentaje = row.valorPorcentaje ?? "";
		this.observacion = row.observacion ?? "";
	}

}
