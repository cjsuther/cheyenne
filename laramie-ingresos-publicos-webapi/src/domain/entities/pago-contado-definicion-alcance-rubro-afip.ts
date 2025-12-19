export default class PagoContadoDefinicionAlcanceRubroAfip {

    id: number;
	idPagoContadoDefinicion: number;
	idRubroAfip: number;

	constructor(
        id: number = 0,
		idPagoContadoDefinicion: number = 0,
		idRubroAfip: number = 0
	)
	{
        this.id = id;
		this.idPagoContadoDefinicion = idPagoContadoDefinicion;
		this.idRubroAfip = idRubroAfip;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPagoContadoDefinicion = row.idPagoContadoDefinicion ?? 0;
		this.idRubroAfip = row.idRubroAfip ?? 0;
	}

}
