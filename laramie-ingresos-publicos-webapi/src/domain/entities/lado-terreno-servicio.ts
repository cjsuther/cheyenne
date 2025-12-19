export default class LadoTerrenoServicio {

    id: number;
	idLadoTerreno: number;
	idTasa: number;
	idSubTasa: number;
	fechaDesde: Date;
	fechaHasta: Date;

	constructor(
        id: number = 0,
		idLadoTerreno: number = 0,
		idTasa: number = 0,
		idSubTasa: number = 0,
		fechaDesde: Date = null,
		fechaHasta: Date = null
	)
	{
        this.id = id;
		this.idLadoTerreno = idLadoTerreno;
		this.idTasa = idTasa;
		this.idSubTasa = idSubTasa;
		this.fechaDesde = fechaDesde;
		this.fechaHasta = fechaHasta;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idLadoTerreno = row.idLadoTerreno ?? 0;
		this.idTasa = row.idTasa ?? 0;
		this.idSubTasa = row.idSubTasa ?? 0;
		this.fechaDesde = (row.fechaDesde) ? new Date(row.fechaDesde) : null;
		this.fechaHasta = (row.fechaHasta) ? new Date(row.fechaHasta) : null;
	}

}
