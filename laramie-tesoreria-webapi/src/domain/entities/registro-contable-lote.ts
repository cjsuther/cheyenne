export default class RegistroContableLote {

    id: number;
	numeroLote: string;
	fechaLote: Date;
	casos: number;
	importeTotal: number;
	idUsuarioProceso: number;
	fechaProceso: Date;
	fechaConfirmacion: Date;
	pathArchivoRegistroContable: string;

	constructor(
        id: number = 0,
		numeroLote: string = "",
		fechaLote: Date = null,
		casos: number = 0,
		importeTotal: number = 0,
		idUsuarioProceso: number = 0,
		fechaProceso: Date = null,
		fechaConfirmacion: Date = null,
		pathArchivoRegistroContable: string = ""
	)
	{
        this.id = id;
		this.numeroLote = numeroLote;
		this.fechaLote = fechaLote;
		this.casos = casos;
		this.importeTotal = importeTotal;
		this.idUsuarioProceso = idUsuarioProceso;
		this.fechaProceso = fechaProceso;
		this.fechaConfirmacion = fechaConfirmacion;
		this.pathArchivoRegistroContable = pathArchivoRegistroContable;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.numeroLote = row.numeroLote ?? "";
		this.fechaLote = row.fechaLote ?? null;
		this.casos = row.casos ?? 0;
		this.importeTotal = row.importeTotal ?? 0;
		this.idUsuarioProceso = row.idUsuarioProceso ?? 0;
		this.fechaProceso = row.fechaProceso ?? null;
		this.fechaConfirmacion = row.fechaConfirmacion ?? null;
		this.pathArchivoRegistroContable = row.pathArchivoRegistroContable ?? "";
	}

}
