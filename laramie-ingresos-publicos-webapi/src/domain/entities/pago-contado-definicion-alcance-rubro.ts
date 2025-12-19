export default class PagoContadoDefinicionAlcanceRubro {

    id: number;
	idPagoContadoDefinicion: number;
	idRubro: number;

	constructor(
        id: number = 0,
		idPagoContadoDefinicion: number = 0,
		idRubro: number = 0
	)
	{
        this.id = id;
		this.idPagoContadoDefinicion = idPagoContadoDefinicion;
		this.idRubro = idRubro;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPagoContadoDefinicion = row.idPagoContadoDefinicion ?? 0;
		this.idRubro = row.idRubro ?? 0;
	}

}
