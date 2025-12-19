import EmisionEjecucionCuenta from "./emision-ejecucion-cuenta";
import EmisionCuota from "./emision-cuota";

export default class EmisionEjecucionCuota {

    id: number;
	idEmisionEjecucion: number;
	idEmisionEjecucionCuenta: number;
	idEmisionCuota: number;
	idPlanPagoCuota: number;
	numeroRecibo: number;
	codigoBarras: string;
	orden: number;
	
	emisionEjecucionCuenta: EmisionEjecucionCuenta;
	emisionCuota: EmisionCuota;

	constructor(
        id: number = 0,
		idEmisionEjecucion: number = 0,
		idEmisionEjecucionCuenta: number = 0,
		idEmisionCuota: number = 0,
		idPlanPagoCuota: number = 0,
		numeroRecibo: number = 0,
		codigoBarras: string = "",
		orden: number = 0,
		emisionEjecucionCuenta: EmisionEjecucionCuenta = null,
		emisionCuota: EmisionCuota = null
	)
	{
        this.id = id;
		this.idEmisionEjecucion = idEmisionEjecucion;
		this.idEmisionEjecucionCuenta = idEmisionEjecucionCuenta;
		this.idEmisionCuota = idEmisionCuota;
		this.idPlanPagoCuota = idPlanPagoCuota;
		this.numeroRecibo = numeroRecibo;
		this.codigoBarras = codigoBarras;
		this.orden = orden;
		this.emisionEjecucionCuenta = emisionEjecucionCuenta;
		this.emisionCuota = emisionCuota;
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
		this.emisionEjecucionCuenta = row.emisionEjecucionCuenta?? null;
		this.emisionCuota = row.emisionCuota?? null;
	}

}
