export default class EmisionCuota {

    id: number;
	idEmisionEjecucion: number;
	cuota: string;
	mes: number;
	descripcion: string;
	formulaCondicion: string;
	anioDDJJ: string;
	mesDDJJ: number;
	fechaVencimiento1: Date;
	fechaVencimiento2: Date;
	orden: number;

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
		orden: number = 0
	)
	{
        this.id = id;
		this.idEmisionEjecucion = idEmisionEjecucion;
		this.cuota = cuota;
		this.mes = mes;
		this.descripcion = descripcion;
		this.formulaCondicion = formulaCondicion;
		this.anioDDJJ = anioDDJJ;
		this.mesDDJJ = mesDDJJ;
		this.fechaVencimiento1 = fechaVencimiento1;
		this.fechaVencimiento2 = fechaVencimiento2;
		this.orden = orden;
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
	}

}
