export default class Proceso {

    id: number;
	identificador: string;
	entidad: string;
	idProcesoProgramacion: number;
	idEstadoProceso: number;
	fechaProceso: Date;
	fechaInicio: Date;
	fechaFin: Date;
	descripcion: string;
	observacion: string;
	avance: number;
	origen: string;
	idUsuarioCreacion: number;
	fechaCreacion: Date;
	urlEjecucion: string;

	constructor(
        id: number = 0,
		identificador: string = "",
		entidad: string = "",
		idProcesoProgramacion: number = 0,
		idEstadoProceso: number = 0,
		fechaProceso: Date = null,
		fechaInicio: Date = null,
		fechaFin: Date = null,
		descripcion: string = "",
		observacion: string = "",
		avance: number = 0,
		origen: string = "",
		idUsuarioCreacion: number = 0,
		fechaCreacion: Date = null,
		urlEjecucion: string = ""
	)
	{
        this.id = id;
		this.identificador = identificador;
		this.entidad = entidad;
		this.idProcesoProgramacion = idProcesoProgramacion;
		this.idEstadoProceso = idEstadoProceso;
		this.fechaProceso = fechaProceso;
		this.fechaInicio = fechaInicio;
		this.fechaFin = fechaFin;
		this.descripcion = descripcion;
		this.observacion = observacion;
		this.avance = avance;
		this.origen = origen;
		this.idUsuarioCreacion = idUsuarioCreacion;
		this.fechaCreacion = fechaCreacion;
		this.urlEjecucion = urlEjecucion;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.identificador = row.identificador ?? "";
		this.entidad = row.entidad ?? "";
		this.idProcesoProgramacion = row.idProcesoProgramacion ?? 0;
		this.idEstadoProceso = row.idEstadoProceso ?? 0;
		this.fechaProceso = row.fechaProceso ?? null;
		this.fechaInicio = row.fechaInicio ?? null;
		this.fechaFin = row.fechaFin ?? null;
		this.descripcion = row.descripcion ?? "";
		this.observacion = row.observacion ?? "";
		this.avance = row.avance ?? 0;
		this.origen = row.origen ?? "";
		this.idUsuarioCreacion = row.idUsuarioCreacion ?? 0;
		this.fechaCreacion = row.fechaCreacion ?? null;
		this.urlEjecucion = row.urlEjecucion ?? "";
	}

}
