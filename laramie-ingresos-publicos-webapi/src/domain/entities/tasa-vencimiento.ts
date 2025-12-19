export default class TasaVencimiento {

    id: number;
	idTasa: number;
	idSubTasa: number;
	periodo: string;
	cuota: number;
	fechaVencimiento1: Date;
	fechaVencimiento2: Date;
	idEmisionEjecucion: number;

	constructor(
        id: number = 0,
		idTasa: number = 0,
		idSubTasa: number = 0,
		periodo: string = "",
		cuota: number = 0,
		fechaVencimiento1: Date = null,
		fechaVencimiento2: Date = null,
		idEmisionEjecucion: number = 0
	)
	{
        this.id = id;
		this.idTasa = idTasa;
		this.idSubTasa = idSubTasa;
		this.periodo = periodo;
		this.cuota = cuota;
		this.fechaVencimiento1 = fechaVencimiento1;
		this.fechaVencimiento2 = fechaVencimiento2;
		this.idEmisionEjecucion = idEmisionEjecucion;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idTasa = row.idTasa ?? 0;
		this.idSubTasa = row.idSubTasa ?? 0;
		this.periodo = row.periodo ?? "";
		this.cuota = row.cuota ?? 0;
		this.fechaVencimiento1 = row.fechaVencimiento1 ?? null;
		this.fechaVencimiento2 = row.fechaVencimiento2 ?? null;
		this.idEmisionEjecucion = row.idEmisionEjecucion ?? 0;
	}

}
