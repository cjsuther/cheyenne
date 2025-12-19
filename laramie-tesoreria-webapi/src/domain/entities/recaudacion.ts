export default class Recaudacion {

    id: number;
	idRecaudacionLote: number;
	idReciboPublicacion: number;
	idRegistroContableLote: number;
	idPagoRendicionLote: number;
	idRecaudadora: number;
	numeroControl: string;
	numeroComprobante: string;
	codigoTipoTributo: string;
	numeroCuenta: string;
	codigoDelegacion: string;
	numeroRecibo: number;
	importeCobro: number;
	fechaCobro: Date;
	codigoBarras: string;
	idUsuarioConciliacion: number;
	fechaConciliacion: Date;
	observacion: string;

	constructor(
        id: number = 0,
		idRecaudacionLote: number = 0,
		idReciboPublicacion: number = 0,
		idRegistroContableLote: number = 0,
		idPagoRendicionLote: number = 0,
		idRecaudadora: number = 0,
		numeroControl: string = "",
		numeroComprobante: string = "",
		codigoTipoTributo: string = "",
		numeroCuenta: string = "",
		codigoDelegacion: string = "",
		numeroRecibo: number = 0,
		importeCobro: number = 0,
		fechaCobro: Date = null,
		codigoBarras: string = "",
		idUsuarioConciliacion: number = 0,
		fechaConciliacion: Date = null,
		observacion: string = ""
	)
	{
        this.id = id;
		this.idRecaudacionLote = idRecaudacionLote;
		this.idReciboPublicacion = idReciboPublicacion;
		this.idRegistroContableLote = idRegistroContableLote;
		this.idPagoRendicionLote = idPagoRendicionLote;
		this.idRecaudadora = idRecaudadora;
		this.numeroControl = numeroControl;
		this.numeroComprobante = numeroComprobante;
		this.codigoTipoTributo = codigoTipoTributo;
		this.numeroCuenta = numeroCuenta;
		this.codigoDelegacion = codigoDelegacion;
		this.numeroRecibo = numeroRecibo;
		this.importeCobro = importeCobro;
		this.fechaCobro = fechaCobro;
		this.codigoBarras = codigoBarras;
		this.idUsuarioConciliacion = idUsuarioConciliacion;
		this.fechaConciliacion = fechaConciliacion;
		this.observacion = observacion;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idRecaudacionLote = row.idRecaudacionLote ?? 0;
		this.idReciboPublicacion = row.idReciboPublicacion ?? 0;
		this.idRegistroContableLote = row.idRegistroContableLote ?? 0;
		this.idPagoRendicionLote = row.idPagoRendicionLote ?? 0;
		this.idRecaudadora = row.idRecaudadora ?? 0;
		this.numeroControl = row.numeroControl ?? "";
		this.numeroComprobante = row.numeroComprobante ?? "";
		this.codigoTipoTributo = row.codigoTipoTributo ?? "";
		this.numeroCuenta = row.numeroCuenta ?? "";
		this.codigoDelegacion = row.codigoDelegacion ?? "";
		this.numeroRecibo = row.numeroRecibo ?? 0;
		this.importeCobro = row.importeCobro ?? 0;
		this.fechaCobro = row.fechaCobro ?? null;
		this.codigoBarras = row.codigoBarras ?? "";
		this.idUsuarioConciliacion = row.idUsuarioConciliacion ?? 0;
		this.fechaConciliacion = row.fechaConciliacion ?? null;
		this.observacion = row.observacion ?? "";
	}

	setFromObjectAddImportacion = (row) =>
	{
        this.id = row.id ?? null;
		this.idRecaudacionLote = row.idRecaudacionLote ?? null;
		this.idReciboPublicacion = row.idReciboPublicacion ?? null;
		this.idRegistroContableLote = row.idRegistroContableLote ?? null;
		this.idPagoRendicionLote = row.idPagoRendicionLote ?? null;
		this.idRecaudadora = row.idRecaudadora ?? null;
		this.numeroControl = row.numeroControl ?? "";
		this.numeroComprobante = row.numeroComprobante ?? "";
		this.codigoTipoTributo = row.codigoTipoTributo ?? "";
		this.numeroCuenta = row.numeroCuenta ?? "";
		this.codigoDelegacion = row.codigoDelegacion ?? "";
		this.numeroRecibo = row.numeroRecibo ?? 0;
		this.importeCobro = row.importeCobro ?? 0;
		this.fechaCobro = row.fechaCobro ? new Date(row.fechaCobro) : null;
		this.codigoBarras = row.codigoBarras ?? "";
		this.idUsuarioConciliacion = row.idUsuarioConciliacion ?? null;
		this.fechaConciliacion = row.fechaConciliacion ? new Date(row.fechaConciliacion) : null;
		this.observacion = row.observacion ?? "";
	}
}
