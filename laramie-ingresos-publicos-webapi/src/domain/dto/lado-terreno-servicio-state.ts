import LadoTerrenoServicio from "../entities/lado-terreno-servicio";

export default class LadoTerrenoServicioState extends LadoTerrenoServicio {

    state: string;

	constructor(
        id: number = 0,
		idLadoTerreno: number = 0,
		idTasa: number = 0,
		idSubTasa: number = 0,
		fechaDesde: Date = null,
		fechaHasta: Date = null,
		state: string = "o"
	)
	{
        super(id, idLadoTerreno, idTasa, idSubTasa, fechaDesde, fechaHasta);
		this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idLadoTerreno = row.idLadoTerreno ?? 0;
		this.idTasa = row.idTasa ?? 0;
		this.idSubTasa = row.idSubTasa ?? 0;
		this.fechaDesde = (row.fechaDesde) ? new Date(row.fechaDesde) : null;
		this.fechaHasta = (row.fechaHasta) ? new Date(row.fechaHasta) : null;
		this.state = row.state ?? "o";
	}

}
