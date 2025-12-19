export default class ActoProcesal {

    id: number;
	idApremio: number;
	idTipoActoProcesal: number;
	fechaDesde: Date;
	fechaHasta: Date;
	observacion: string;

	constructor(
        id: number = 0,
		idApremio: number = 0,
		idTipoActoProcesal: number = 0,
		fechaDesde: Date = null,
		fechaHasta: Date = null,
		observacion: string = ""
	)
	{
        this.id = id;
		this.idApremio = idApremio;
		this.idTipoActoProcesal = idTipoActoProcesal;
		this.fechaDesde = fechaDesde;
		this.fechaHasta = fechaHasta;
		this.observacion = observacion;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idApremio = row.idApremio ?? 0;
		this.idTipoActoProcesal = row.idTipoActoProcesal ?? 0;
		this.fechaDesde = row.fechaDesde ?? null;
		this.fechaHasta = row.fechaHasta ?? null;
		this.observacion = row.observacion ?? "";
	}

}
