import CajaAsignacion from "./caja-asignacion";

export default class Caja {

    id: number;
	codigo: string;
	nombre: string;
	orden: number;
	idDependencia: number;
	idEstadoCaja: number;
	idUsuarioActual: number;
	idCajaAsignacionActual: number;
	idRecaudadora: number;

	cajaAsignacion: CajaAsignacion = null;

	constructor(
        id: number = 0,
		codigo: string = "",
		nombre: string = "",
		orden: number = 0,
		idDependencia: number = 0,
		idEstadoCaja: number = 0,
		idUsuarioActual: number = 0,
		idCajaAsignacionActual: number = 0,
		idRecaudadora: number = 0
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.nombre = nombre;
		this.orden = orden;
		this.idDependencia = idDependencia;
		this.idEstadoCaja = idEstadoCaja;
		this.idUsuarioActual = idUsuarioActual;
		this.idCajaAsignacionActual = idCajaAsignacionActual;
		this.idRecaudadora = idRecaudadora;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.orden = row.orden ?? 0;
		this.idDependencia = row.idDependencia ?? 0;
		this.idEstadoCaja = row.idEstadoCaja ?? 0;
		this.idUsuarioActual = row.idUsuarioActual ?? 0;
		this.idCajaAsignacionActual = row.idCajaAsignacionActual ?? 0;
		this.idRecaudadora = row.idRecaudadora ?? 0;
	}

}
