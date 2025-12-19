export default class MovimientoMedioPago {

    id: number;
	idMovimientoCaja: number;
	idMedioPago: number;
	numeroMedioPago: string;
	bancoMedioPago: string;
	importeCobro: number;

	constructor(
        id: number = 0,
		idMovimientoCaja: number = 0,
		idMedioPago: number = 0,
		numeroMedioPago: string = "",
		bancoMedioPago: string = "",
		importeCobro: number = 0
	)
	{
        this.id = id;
		this.idMovimientoCaja = idMovimientoCaja;
		this.idMedioPago = idMedioPago;
		this.numeroMedioPago = numeroMedioPago;
		this.bancoMedioPago = bancoMedioPago;
		this.importeCobro = importeCobro;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idMovimientoCaja = row.idMovimientoCaja ?? 0;
		this.idMedioPago = row.idMedioPago ?? 0;
		this.numeroMedioPago = row.numeroMedioPago ?? "";
		this.bancoMedioPago = row.bancoMedioPago ?? "";
		this.importeCobro = row.importeCobro ?? 0;
	}

}
