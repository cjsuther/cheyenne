import VariableCuenta from "../entities/variable-cuenta";

export default class VariableCuentaState extends VariableCuenta {

    state: string;

	constructor(
        id: number = 0,
		idVariable: number = 0,
		idCuenta: number = 0,
		valor: string = "",
		fechaDesde: Date = null,
		fechaHasta: Date = null,
		state: string = "o"
	)
	{
		super(id, idVariable, idCuenta, valor, fechaDesde, fechaHasta);
		this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idVariable = row.idVariable ?? 0;
		this.idCuenta = row.idCuenta ?? 0;
		this.valor = row.valor ?? "";
		this.fechaDesde = row.fechaDesde ?? null;
		this.fechaHasta = row.fechaHasta ?? null;
		this.state = row.state ?? "o";
	}

}
