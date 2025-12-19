import RecaudacionLote from "../entities/recaudacion-lote";

export default class RecaudacionLoteConciliacion extends RecaudacionLote {

    casosNoConciliados: number;

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
		nombreArchivoRecaudacion: string = "",
		casosNoConciliados: number = 0
	)
	{
        super(id, numeroLote, fechaLote, casos, idUsuarioProceso, fechaProceso, idOrigenRecaudacion, idRecaudadora, fechaAcreditacion, idUsuarioControl, fechaControl, idUsuarioConciliacion, fechaConciliacion, importeTotal, importeNeto, pathArchivoRecaudacion, nombreArchivoRecaudacion);
		this.casosNoConciliados = casosNoConciliados;
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
		this.casosNoConciliados = row.casosNoConciliados ?? 0;
	}

}
