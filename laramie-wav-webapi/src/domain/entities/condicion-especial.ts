export default class CondicionEspecial {

    id: number;
	idCuenta: number;
	idTipoCondicionEspecial: number;
	fechaDesde: Date;
	fechaHasta: Date;

	constructor(
        id: number = 0,
		idCuenta: number = 0,
		idTipoCondicionEspecial: number = 0,
		fechaDesde: Date = null,
		fechaHasta: Date = null
	)
	{
        this.id = id;
		this.idCuenta = idCuenta;
		this.idTipoCondicionEspecial = idTipoCondicionEspecial;
		this.fechaDesde = fechaDesde;
		this.fechaHasta = fechaHasta;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idCuenta = row.idCuenta ?? 0;
		this.idTipoCondicionEspecial = row.idTipoCondicionEspecial ?? 0;
		this.fechaDesde = row.fechaDesde ?? null;
		this.fechaHasta = row.fechaHasta ?? null;
	}

}