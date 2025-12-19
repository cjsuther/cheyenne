export default class RecaudacionLote {

	fechaLote: Date;
	casos: number;
	idUsuarioProceso: number;
	fechaProceso: Date;
	fechaAcreditacion: Date;
	importeTotal: number;

	constructor(
		fechaLote: Date = null,
		casos: number = 0,
		idUsuarioProceso: number = 0,
		fechaProceso: Date = null,
		fechaAcreditacion: Date = null,
		importeTotal: number = 0
	)
	{
		this.fechaLote = fechaLote;
		this.casos = casos;
		this.idUsuarioProceso = idUsuarioProceso;
		this.fechaProceso = fechaProceso;
		this.fechaAcreditacion = fechaAcreditacion;
		this.importeTotal = importeTotal;
	}

	setFromObject = (row) =>
	{
		this.fechaLote = row.fechaLote ?? null;
		this.casos = row.casos ?? 0;
		this.idUsuarioProceso = row.idUsuarioProceso ?? 0;
		this.fechaProceso = row.fechaProceso ?? null;
		this.fechaAcreditacion = row.fechaAcreditacion ?? null;
		this.importeTotal = row.importeTotal ?? 0;
	}

}
