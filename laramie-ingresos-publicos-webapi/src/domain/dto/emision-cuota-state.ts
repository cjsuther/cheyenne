import EmisionCuota from "../entities/emision-cuota";

export default class EmisionCuotaState extends EmisionCuota {

    state: string;

	constructor(
        id: number = 0,
		idEmisionEjecucion: number = 0,
		cuota: string = "",
		mes: number = 0,
		descripcion: string = "",
		formulaCondicion: string = "",
		anioDDJJ: string = "",
		mesDDJJ: number = 0,
		fechaVencimiento1: Date = null,
		fechaVencimiento2: Date = null,
		orden: number = 0,
		state: string = "o"
	)
	{
        super(id, idEmisionEjecucion, cuota, mes, descripcion, formulaCondicion, anioDDJJ, mesDDJJ, 
			  fechaVencimiento1, fechaVencimiento2, orden);
		this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idEmisionEjecucion = row.idEmisionEjecucion ?? 0;
		this.cuota = row.cuota ?? "";
		this.mes = row.mes ?? 0;
		this.descripcion = row.descripcion ?? "";
		this.formulaCondicion = row.formulaCondicion ?? "";
		this.anioDDJJ = row.anioDDJJ ?? "";
		this.mesDDJJ = row.mesDDJJ ?? 0;
		this.fechaVencimiento1 = row.fechaVencimiento1 ?? null;
		this.fechaVencimiento2 = row.fechaVencimiento2 ?? null;
		this.orden = row.orden ?? 0;
		this.state = row.state ?? "o";
	}

}
