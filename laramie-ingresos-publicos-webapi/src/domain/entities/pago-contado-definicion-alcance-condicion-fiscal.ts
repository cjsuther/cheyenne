export default class PagoContadoDefinicionAlcanceCondicionFiscal {

    id: number;
	idPagoContadoDefinicion: number;
	idCondicionFiscal: number;

	constructor(
        id: number = 0,
		idPagoContadoDefinicion: number = 0,
		idCondicionFiscal: number = 0
	)
	{
        this.id = id;
		this.idPagoContadoDefinicion = idPagoContadoDefinicion;
		this.idCondicionFiscal = idCondicionFiscal;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPagoContadoDefinicion = row.idPagoContadoDefinicion ?? 0;
		this.idCondicionFiscal = row.idCondicionFiscal ?? 0;
	}

}
