export default class Incidencia {

    id: number;
	token: string;
	idTipoIncidencia: number;
	idNivelCriticidad: number;
	idUsuario: number;
	fecha: Date;
	idModulo: number;
	origen: string;
	mensaje: string;
	error: Object;
	data: Object;

	constructor(
        id: number = 0,
		token: string = "",
		idTipoIncidencia: number = 0,
		idNivelCriticidad: number = 0,
		idUsuario: number = 0,
		fecha: Date = null,
		idModulo: number = 0,
		origen: string = "",
		mensaje: string = "",
		error: Object = {},
		data: Object = {}
	)
	{
        this.id = id;
		this.token = token;
		this.idTipoIncidencia = idTipoIncidencia;
		this.idNivelCriticidad = idNivelCriticidad;
		this.idUsuario = idUsuario;
		this.fecha = fecha;
		this.idModulo = idModulo;
		this.origen = origen;
		this.mensaje = mensaje;
		this.error = error;
		this.data = data;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.token = row.token ?? "";
		this.idTipoIncidencia = row.idTipoIncidencia ?? 0;
		this.idNivelCriticidad = row.idNivelCriticidad ?? 0;
		this.idUsuario = row.idUsuario ?? 0;
		this.fecha = row.fecha ?? null;
		this.idModulo = row.idModulo ?? 0;
		this.origen = row.origen ?? "";
		this.mensaje = row.mensaje ?? "";
		this.error = row.error ?? {};
		this.data = row.data ?? {};
	}

}
