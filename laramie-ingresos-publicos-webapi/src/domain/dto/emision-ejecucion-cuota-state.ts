import EmisionEjecucionCuota from "../entities/emision-ejecucion-cuota";

export default class EmisionEjecucionCuotaState extends EmisionEjecucionCuota {

    state: string;

	constructor(
        id: number = 0,
		idEmisionEjecucion: number = 0,
		idEmisionEjecucionCuenta: number = 0,
		idEmisionCuota: number = 0,
		idPlanPagoCuota: number = 0,
		numeroRecibo: number = 0,
		codigoBarras: string = "",
		orden: number = 0,
		state: string = "o"
	)
	{
        super(id, idEmisionEjecucion, idEmisionEjecucionCuenta, idEmisionCuota, idPlanPagoCuota, numeroRecibo, codigoBarras, orden);
	  	this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idEmisionEjecucion = row.idEmisionEjecucion ?? 0;
		this.idEmisionEjecucionCuenta = row.idEmisionEjecucionCuenta ?? 0;
		this.idEmisionCuota = row.idEmisionCuota ?? 0;
		this.idPlanPagoCuota = row.idPlanPagoCuota ?? 0;
		this.numeroRecibo = row.numeroRecibo ?? 0;
		this.codigoBarras = row.codigoBarras ?? "";
		this.orden = row.orden ?? 0;
		this.state = row.state ?? "o";
	}

}
