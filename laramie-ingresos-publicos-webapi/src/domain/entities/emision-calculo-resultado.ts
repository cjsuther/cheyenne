export default class EmisionCalculoResultado {

    id: number;
	idEmisionEjecucion: number;
	idEmisionEjecucionCuenta: number;
	idEmisionCalculo: number;
	idEmisionCuota: number;
	idEstadoEmisionCalculoResultado: number;
	valor: string;
	observacion: string;

	constructor(
        id: number = 0,
		idEmisionEjecucion: number = 0,
		idEmisionEjecucionCuenta: number = 0,
		idEmisionCalculo: number = 0,
		idEmisionCuota: number = 0,
		idEstadoEmisionCalculoResultado: number = 0,
		valor: string = "",
		observacion: string = ""
	)
	{
        this.id = id;
		this.idEmisionEjecucion = idEmisionEjecucion;
		this.idEmisionEjecucionCuenta = idEmisionEjecucionCuenta;
		this.idEmisionCalculo = idEmisionCalculo;
		this.idEmisionCuota = idEmisionCuota;
		this.idEstadoEmisionCalculoResultado = idEstadoEmisionCalculoResultado;
		this.valor = valor;
		this.observacion = observacion;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idEmisionEjecucion = row.idEmisionEjecucion ?? 0;
		this.idEmisionEjecucionCuenta = row.idEmisionEjecucionCuenta ?? 0;
		this.idEmisionCalculo = row.idEmisionCalculo ?? 0;
		this.idEmisionCuota = row.idEmisionCuota ?? 0;
		this.idEstadoEmisionCalculoResultado = row.idEstadoEmisionCalculoResultado ?? 0;
		this.valor = row.valor ?? "";
		this.observacion = row.observacion ?? "";
	}

}
