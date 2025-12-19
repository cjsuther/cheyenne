export default class MovimientoCaja {

    id: number;
	idCaja: number;
	idCajaAsignacion: number;
	idTipoMovimientoCaja: number;
	importeCobro: number;
	fechaCobro: Date;
	observacion: string;

	constructor(
        id: number = 0,
		idCaja: number = 0,
		idCajaAsignacion: number = 0,
		idTipoMovimientoCaja: number = 0,
		importeCobro: number = 0,
		fechaCobro: Date = null,
		observacion: string = ""
	)
	{
        this.id = id;
		this.idCaja = idCaja;
		this.idCajaAsignacion = idCajaAsignacion;
		this.idTipoMovimientoCaja = idTipoMovimientoCaja;
		this.importeCobro = importeCobro;
		this.fechaCobro = fechaCobro;
		this.observacion = observacion;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idCaja = row.idCaja ?? 0;
		this.idCajaAsignacion = row.idCajaAsignacion ?? 0;
		this.idTipoMovimientoCaja = row.idTipoMovimientoCaja ?? 0;
		this.importeCobro = row.importeCobro ?? 0;
		this.fechaCobro = row.fechaCobro ?? null;
		this.observacion = row.observacion ?? "";
	}

}
