import PagoContadoDefinicionAlcanceGrupo from "../entities/pago-contado-definicion-alcance-grupo";

export default class PagoContadoDefinicionAlcanceGrupoState extends PagoContadoDefinicionAlcanceGrupo  {

    state: string;

	constructor(
        id: number = 0,
		idPagoContadoDefinicion: number = 0,
		idGrupo: number = 0,
        state: string = "o"
	)
	{
        super(id, idPagoContadoDefinicion, idGrupo);
        this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPagoContadoDefinicion = row.idPagoContadoDefinicion ?? 0;
		this.idGrupo = row.idGrupo ?? 0;
        this.state = row.state ?? "o";
	}

}
