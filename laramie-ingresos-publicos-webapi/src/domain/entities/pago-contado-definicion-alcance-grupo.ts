export default class PagoContadoDefinicionAlcanceGrupo {

    id: number;
	idPagoContadoDefinicion: number;
	idGrupo: number;

	constructor(
        id: number = 0,
		idPagoContadoDefinicion: number = 0,
		idGrupo: number = 0
	)
	{
        this.id = id;
		this.idPagoContadoDefinicion = idPagoContadoDefinicion;
		this.idGrupo = idGrupo;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPagoContadoDefinicion = row.idPagoContadoDefinicion ?? 0;
		this.idGrupo = row.idGrupo ?? 0;
	}

}
