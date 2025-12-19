import ActoProcesal from "../entities/acto-procesal";

export default class ActoProcesalState extends ActoProcesal{

	state: string;

	constructor(
        id: number = 0,
		idApremio: number = 0,
		idTipoActoProcesal: number = 0,
		fechaDesde: Date = null,
		fechaHasta: Date = null,
		observacion: string = "",
		state: string = "o"
	)
	{
        super(
			id, idApremio, idTipoActoProcesal, fechaDesde, fechaHasta, observacion, 
		);
		this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idApremio = row.idApremio ?? 0;
		this.idTipoActoProcesal = row.idTipoActoProcesal ?? 0;
		this.fechaDesde = row.fechaDesde ?? null;
		this.fechaHasta = row.fechaHasta ?? null;
		this.observacion = row.observacion ?? "";
		this.state = row.state ?? "o";
	}

}
