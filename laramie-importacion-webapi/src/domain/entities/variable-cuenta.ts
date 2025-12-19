export default class VariableCuenta {

    id: number;
	idVariable: number;
	idCuenta: number;
	valor: string;
	fechaDesde: Date;
	fechaHasta: Date;

	constructor(
        id: number = 0,
		idVariable: number = 0,
		idCuenta: number = 0,
		valor: string = "",
		fechaDesde: Date = null,
		fechaHasta: Date = null,
	)
	{
        this.id = id;
		this.idVariable = idVariable;
		this.idCuenta = idCuenta;
		this.valor = valor;
		this.fechaDesde = fechaDesde;
		this.fechaHasta = fechaHasta
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idVariable = row.idVariable ?? 0;
		this.idCuenta = row.idCuenta ?? 0;
		this.valor = row.valor ?? "";
		this.fechaDesde = row.fechaDesde ?? null;
		this.fechaHasta = row.fechaHasta ?? null
	}

}
