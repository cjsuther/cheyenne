export default class Mensaje {

    id: number;
	idTipoMensaje: number;
	idEstadoMensaje: number;
	idCanal: number;
	idPrioridad: number;
	identificador: string;
	titulo: string;
	cuerpo: string;
	idUsuarioCreacion: number;
	fechaCreacion: Date;
	fechaRecepcion: Date;
	fechaEnvio: Date;

	constructor(
        id: number = 0,
		idTipoMensaje: number = 0,
		idEstadoMensaje: number = 0,
		idCanal: number = 0,
		idPrioridad: number = 0,
		identificador: string = "",
		titulo: string = "",
		cuerpo: string = "",
		idUsuarioCreacion: number = 0,
		fechaCreacion: Date = null,
		fechaRecepcion: Date = null,
		fechaEnvio: Date = null
	)
	{
        this.id = id;
		this.idTipoMensaje = idTipoMensaje;
		this.idEstadoMensaje = idEstadoMensaje;
		this.idCanal = idCanal;
		this.idPrioridad = idPrioridad;
		this.identificador = identificador;
		this.titulo = titulo;
		this.cuerpo = cuerpo;
		this.idUsuarioCreacion = idUsuarioCreacion;
		this.fechaCreacion = fechaCreacion;
		this.fechaRecepcion = fechaRecepcion;
		this.fechaEnvio = fechaEnvio;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idTipoMensaje = row.idTipoMensaje ?? 0;
		this.idEstadoMensaje = row.idEstadoMensaje ?? 0;
		this.idCanal = row.idCanal ?? 0;
		this.idPrioridad = row.idPrioridad ?? 0;
		this.identificador = row.identificador ?? "";
		this.titulo = row.titulo ?? "";
		this.cuerpo = row.cuerpo ?? "";
		this.idUsuarioCreacion = row.idUsuarioCreacion ?? 0;
		this.fechaCreacion = row.fechaCreacion ?? null;
		this.fechaRecepcion = row.fechaRecepcion ?? null;
		this.fechaEnvio = row.fechaEnvio ?? null;
	}

}
