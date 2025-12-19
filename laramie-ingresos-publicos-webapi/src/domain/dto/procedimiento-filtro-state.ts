import ProcedimientoFiltro from "../entities/procedimiento-filtro";

export default class ProcedimientoFiltroState extends ProcedimientoFiltro {

    state: string;

	constructor(
        id: number = 0,
		idProcedimiento: number = 0,
		idFiltro: number = 0,
        state: string = "o"
	)
	{
        super(id, idProcedimiento, idFiltro);
        this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idProcedimiento = row.idProcedimiento ?? 0;
		this.idFiltro = row.idFiltro ?? 0;
		this.state = row.state ?? "o";
	}

}
