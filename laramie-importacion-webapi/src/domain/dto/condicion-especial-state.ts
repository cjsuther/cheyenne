import CondicionEspecial from "../entities/condicion-especial";

export default class CondicionEspecialState extends CondicionEspecial {

    state: string;

	constructor(
        id: number = 0,
		idCuenta: number = 0,
		idTipoCondicionEspecial: number = 0,
		fechaDesde: Date = null,
		fechaHasta: Date = null,
		state: string = "o"
	)
	{
        super(id, idCuenta, idTipoCondicionEspecial, fechaDesde, fechaHasta);
		this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idCuenta = row.idCuenta ?? 0;
		this.idTipoCondicionEspecial = row.idTipoCondicionEspecial ?? 0;
		this.fechaDesde = row.fechaDesde ?? null;
		this.fechaHasta = row.fechaHasta ?? null;
		this.state = row.state ?? "o";

	}

}