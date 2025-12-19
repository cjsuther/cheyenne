export default class ProcesoProgramacion {

    id: number;
	entidad: string;
	descripcion: string;
	urlEjecucion: string;
	idTipoProgramacion: number;
	diasProgramacion: string;
	fechaUltimaProgramacion: Date;
	activa: boolean;

	constructor(
        id: number = 0,
		entidad: string = "",
		descripcion: string = "",
		urlEjecucion: string = "",
		idTipoProgramacion: number = 0,
		diasProgramacion: string = "",
		fechaUltimaProgramacion: Date = null,
		activa: boolean = false
	)
	{
        this.id = id;
		this.entidad = entidad;
		this.descripcion = descripcion;
		this.urlEjecucion = urlEjecucion;
		this.idTipoProgramacion = idTipoProgramacion;
		this.diasProgramacion = diasProgramacion;
		this.fechaUltimaProgramacion = fechaUltimaProgramacion;
		this.activa = activa;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.entidad = row.entidad ?? "";
		this.descripcion = row.descripcion ?? "";
		this.urlEjecucion = row.urlEjecucion ?? "";
		this.idTipoProgramacion = row.idTipoProgramacion ?? 0;
		this.diasProgramacion = row.diasProgramacion ?? "";
		this.fechaUltimaProgramacion = row.fechaUltimaProgramacion ?? null;
		this.activa = row.activa ?? false;
	}

}
