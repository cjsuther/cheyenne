import ControladorCuenta from "../entities/controlador-cuenta";

export default class ControladorCuentaState extends ControladorCuenta {

    state: string;

	constructor(
        id: number = 0,
		idCuenta: number = 0,
		idTipoControlador: number = 0,
		idControlador: number = 0,
		fechaDesde: Date = null,
		fechaHasta: Date = null,
		state: string = "o"
	)
	{
        super(id, idCuenta, idTipoControlador, idControlador, fechaDesde, fechaHasta);
		this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idCuenta = row.idCuenta ?? 0;
		this.idTipoControlador = row.idTipoControlador ?? 0;
		this.idControlador = row.idControlador ?? 0;
		this.fechaDesde = row.fechaDesde ?? null;
		this.fechaHasta = row.fechaHasta ?? null;
		this.state = row.state ?? "o";
	}

}
