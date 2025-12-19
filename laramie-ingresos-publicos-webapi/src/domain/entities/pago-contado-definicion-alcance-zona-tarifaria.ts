export default class PagoContadoDefinicionAlcanceZonaTarifaria {

    id: number;
	idPagoContadoDefinicion: number;
	idZonaTarifaria: number;

	constructor(
        id: number = 0,
		idPagoContadoDefinicion: number = 0,
		idZonaTarifaria: number = 0
	)
	{
        this.id = id;
		this.idPagoContadoDefinicion = idPagoContadoDefinicion;
		this.idZonaTarifaria = idZonaTarifaria;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPagoContadoDefinicion = row.idPagoContadoDefinicion ?? 0;
		this.idZonaTarifaria = row.idZonaTarifaria ?? 0;
	}

}
