export default class PagoContadoDefinicionAlcanceFormaJuridica {

    id: number;
	idPagoContadoDefinicion: number;
	idFormaJuridica: number;

	constructor(
        id: number = 0,
		idPagoContadoDefinicion: number = 0,
		idFormaJuridica: number = 0
	)
	{
        this.id = id;
		this.idPagoContadoDefinicion = idPagoContadoDefinicion;
		this.idFormaJuridica = idFormaJuridica;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPagoContadoDefinicion = row.idPagoContadoDefinicion ?? 0;
		this.idFormaJuridica = row.idFormaJuridica ?? 0;
	}

}
