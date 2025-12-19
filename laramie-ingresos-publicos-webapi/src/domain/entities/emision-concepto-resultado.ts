export default class EmisionConceptoResultado {

    id: number;
	idEmisionEjecucion: number;
	idEmisionEjecucionCuenta: number;
	idEmisionConcepto: number;
	idEmisionCuota: number;
	idEstadoEmisionConceptoResultado: number;
	valorImporteTotal: string;
	valorImporteNeto: string;
	observacion: string;

	constructor(
        id: number = 0,
		idEmisionEjecucion: number = 0,
		idEmisionEjecucionCuenta: number = 0,
		idEmisionConcepto: number = 0,
		idEmisionCuota: number = 0,
		idEstadoEmisionConceptoResultado: number = 0,
		valorImporteTotal: string = "",
		valorImporteNeto: string = "",
		observacion: string = ""
	)
	{
        this.id = id;
		this.idEmisionEjecucion = idEmisionEjecucion;
		this.idEmisionEjecucionCuenta = idEmisionEjecucionCuenta;
		this.idEmisionConcepto = idEmisionConcepto;
		this.idEmisionCuota = idEmisionCuota;
		this.idEstadoEmisionConceptoResultado = idEstadoEmisionConceptoResultado;
		this.valorImporteTotal = valorImporteTotal;
		this.valorImporteNeto = valorImporteNeto;
		this.observacion = observacion;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idEmisionEjecucion = row.idEmisionEjecucion ?? 0;
		this.idEmisionEjecucionCuenta = row.idEmisionEjecucionCuenta ?? 0;
		this.idEmisionConcepto = row.idEmisionConcepto ?? 0;
		this.idEmisionCuota = row.idEmisionCuota ?? 0;
		this.idEstadoEmisionConceptoResultado = row.idEstadoEmisionConceptoResultado ?? 0;
		this.valorImporteTotal = row.valorImporteTotal ?? "";
		this.valorImporteNeto = row.valorImporteNeto ?? "";
		this.observacion = row.observacion ?? "";
	}

}
