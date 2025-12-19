export default class PagoContadoDefinicionAlcanceTasa {

    id: number;
	idPagoContadoDefinicion: number;
	idTasa: number;
	idSubTasa: number;

	constructor(
        id: number = 0,
		idPagoContadoDefinicion: number = 0,
		idTasa: number = 0,
		idSubTasa: number = 0
	)
	{
        this.id = id;
		this.idPagoContadoDefinicion = idPagoContadoDefinicion;
		this.idTasa = idTasa;
		this.idSubTasa = idSubTasa;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPagoContadoDefinicion = row.idPagoContadoDefinicion ?? 0;
		this.idTasa = row.idTasa ?? 0;
		this.idSubTasa = row.idSubTasa ?? 0;
	}

}
