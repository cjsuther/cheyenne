import Controlador from "./controlador";
import TipoControlador from "./tipo-controlador";

export default class ControladorCuenta {

    id: number;
	idCuenta: number;
	idTipoControlador: number;
	idControlador: number;
	fechaDesde: Date;
	fechaHasta: Date;

	tipoControlador: TipoControlador;
	controlador: Controlador;

	constructor(
        id: number = 0,
		idCuenta: number = 0,
		idTipoControlador: number = 0,
		idControlador: number = 0,
		fechaDesde: Date = null,
		fechaHasta: Date = null,
		tipoControlador: TipoControlador = null,
		controlador: Controlador = null
	)
	{
        this.id = id;
		this.idCuenta = idCuenta;
		this.idTipoControlador = idTipoControlador;
		this.idControlador = idControlador;
		this.fechaDesde = fechaDesde;
		this.fechaHasta = fechaHasta;
		this.tipoControlador = tipoControlador;
		this.controlador = controlador;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idCuenta = row.idCuenta ?? 0;
		this.idTipoControlador = row.idTipoControlador ?? 0;
		this.idControlador = row.idControlador ?? 0;
		this.fechaDesde = row.fechaDesde ?? null;
		this.fechaHasta = row.fechaHasta ?? null;
		this.tipoControlador = row.tipoControlador?? null;
		this.controlador = row.controlador?? null;
	}

}
