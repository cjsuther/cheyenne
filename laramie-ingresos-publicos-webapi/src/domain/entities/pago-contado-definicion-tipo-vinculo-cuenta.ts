export default class PagoContadoDefinicionTipoVinculoCuenta {

    id: number;
	idPagoContadoDefinicion: number;
	idTipoVinculoCuenta: number;

	constructor(
        id: number = 0,
		idPagoContadoDefinicion: number = 0,
		idTipoVinculoCuenta: number = 0
	)
	{
        this.id = id;
		this.idPagoContadoDefinicion = idPagoContadoDefinicion;
		this.idTipoVinculoCuenta = idTipoVinculoCuenta;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPagoContadoDefinicion = row.idPagoContadoDefinicion ?? 0;
		this.idTipoVinculoCuenta = row.idTipoVinculoCuenta ?? 0;
	}

}
