export default class RecaudacionLote {

    id: number;
	numeroLote: string;
	fechaLote: Date;
	casos: number;
	idUsuarioProceso: number;
	fechaProceso: Date;
	idOrigenRecaudacion: number;
	idRecaudadora: number;
	fechaAcreditacion: Date;
	idUsuarioControl: number;
	fechaControl: Date;
	idUsuarioConciliacion: number;
	fechaConciliacion: Date;
	importeTotal: number;
	importeNeto: number;
	pathArchivoRecaudacion: string;
	nombreArchivoRecaudacion: string;

	constructor(
        id: number = 0,
		numeroLote: string = "",
		fechaLote: Date = null,
		casos: number = 0,
		idUsuarioProceso: number = 0,
		fechaProceso: Date = null,
		idOrigenRecaudacion: number = 0,
		idRecaudadora: number = 0,
		fechaAcreditacion: Date = null,
		idUsuarioControl: number = 0,
		fechaControl: Date = null,
		idUsuarioConciliacion: number = 0,
		fechaConciliacion: Date = null,
		importeTotal: number = 0,
		importeNeto: number = 0,
		pathArchivoRecaudacion: string = "",
		nombreArchivoRecaudacion: string = ""
	)
	{
        this.id = id;
		this.numeroLote = numeroLote;
		this.fechaLote = fechaLote;
		this.casos = casos;
		this.idUsuarioProceso = idUsuarioProceso;
		this.fechaProceso = fechaProceso;
		this.idOrigenRecaudacion = idOrigenRecaudacion;
		this.idRecaudadora = idRecaudadora;
		this.fechaAcreditacion = fechaAcreditacion;
		this.idUsuarioControl = idUsuarioControl;
		this.fechaControl = fechaControl;
		this.idUsuarioConciliacion = idUsuarioConciliacion;
		this.fechaConciliacion = fechaConciliacion;
		this.importeTotal = importeTotal;
		this.importeNeto = importeNeto;
		this.pathArchivoRecaudacion = pathArchivoRecaudacion;
		this.nombreArchivoRecaudacion = nombreArchivoRecaudacion;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.numeroLote = row.numeroLote ?? "";
		this.fechaLote = row.fechaLote ?? null;
		this.casos = row.casos ?? 0;
		this.idUsuarioProceso = row.idUsuarioProceso ?? 0;
		this.fechaProceso = row.fechaProceso ?? null;
		this.idOrigenRecaudacion = row.idOrigenRecaudacion ?? 0;
		this.idRecaudadora = row.idRecaudadora ?? 0;
		this.fechaAcreditacion = row.fechaAcreditacion ?? null;
		this.idUsuarioControl = row.idUsuarioControl ?? 0;
		this.fechaControl = row.fechaControl ?? null;
		this.idUsuarioConciliacion = row.idUsuarioConciliacion ?? 0;
		this.fechaConciliacion = row.fechaConciliacion ?? null;
		this.importeTotal = row.importeTotal ?? 0;
		this.importeNeto = row.importeNeto ?? 0;
		this.pathArchivoRecaudacion = row.pathArchivoRecaudacion ?? "";
		this.nombreArchivoRecaudacion = row.nombreArchivoRecaudacion ?? "";
	}

	setFromObjectAddImportacion = (row) =>
	{
        this.id = row.id ?? null;
		this.numeroLote = row.numeroLote ?? "";
		this.fechaLote = row.fechaLote ? new Date(row.fechaLote) : null;
		this.casos = row.casos ?? 0;
		this.idUsuarioProceso = row.idUsuarioProceso ?? null;
		this.fechaProceso = row.fechaProceso ? new Date(row.fechaProceso) : null;
		this.idOrigenRecaudacion = row.idOrigenRecaudacion ?? null;
		this.idRecaudadora = row.idRecaudadora ?? null;
		this.fechaAcreditacion = row.fechaAcreditacion ? new Date(row.fechaAcreditacion) : null;
		this.idUsuarioControl = row.idUsuarioControl ?? null;
		this.fechaControl = row.fechaControl ? new Date(row.fechaControl) : null;
		this.idUsuarioConciliacion = row.idUsuarioConciliacion ?? null;
		this.fechaConciliacion = row.fechaConciliacion ? new Date(row.fechaConciliacion) : null;
		this.importeTotal = row.importeTotal ?? 0;
		this.importeNeto = row.importeNeto ?? 0;
		this.pathArchivoRecaudacion = row.pathArchivoRecaudacion ?? "";
		this.nombreArchivoRecaudacion = row.nombreArchivoRecaudacion ?? "";
	}

}
