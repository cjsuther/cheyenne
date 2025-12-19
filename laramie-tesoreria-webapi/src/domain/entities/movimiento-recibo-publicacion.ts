export default class MovimientoReciboPublicacion {

    id: number;
	idMovimientoCaja: number;
	idReciboPublicacion: number;
	importeCobro: number;

	constructor(
        id: number = 0,
		idMovimientoCaja: number = 0,
		idReciboPublicacion: number = 0,
		importeCobro: number = 0
	)
	{
        this.id = id;
		this.idMovimientoCaja = idMovimientoCaja;
		this.idReciboPublicacion = idReciboPublicacion;
		this.importeCobro = importeCobro;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idMovimientoCaja = row.idMovimientoCaja ?? 0;
		this.idReciboPublicacion = row.idReciboPublicacion ?? 0;
		this.importeCobro = row.importeCobro ?? 0;
	}

}
