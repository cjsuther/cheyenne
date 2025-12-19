export default class Recaudacion {

	numeroControl: string;
	numeroComprobante: string;
	codigoTipoTributo: string;
	numeroCuenta: string;
	codigoDelegacion: string;
	numeroRecibo: number;
	importeCobro: number;
	fechaCobro: Date;
	codigoBarras: string;
	observacion: string;

	constructor(
		numeroControl: string = "",
		numeroComprobante: string = "",
		codigoTipoTributo: string = "",
		numeroCuenta: string = "",
		codigoDelegacion: string = "",
		numeroRecibo: number = 0,
		importeCobro: number = 0,
		fechaCobro: Date = null,
		codigoBarras: string = "",
		observacion: string = ""
	)
	{
		// this.idRecaudacionLote = idRecaudacionLote;
		// this.idReciboPublicacion = idReciboPublicacion;
		// this.idRegistroContableLote = idRegistroContableLote;
		// this.idPagoRendicionLote = idPagoRendicionLote;
		// this.idRecaudadora = idRecaudadora;
		this.numeroControl = numeroControl;
		this.numeroComprobante = numeroComprobante;
		this.codigoTipoTributo = codigoTipoTributo;
		this.numeroCuenta = numeroCuenta;
		this.codigoDelegacion = codigoDelegacion;
		this.numeroRecibo = numeroRecibo;
		this.importeCobro = importeCobro;
		this.fechaCobro = fechaCobro;
		this.codigoBarras = codigoBarras;
		// this.idUsuarioConciliacion = idUsuarioConciliacion;
		// this.fechaConciliacion = fechaConciliacion;
		this.observacion = observacion;
	}

	setFromObject = (row) =>
	{
		this.numeroControl = row.numeroControl ?? "";
		this.numeroComprobante = row.numeroComprobante ?? "";
		this.codigoTipoTributo = row.codigoTipoTributo ?? "";
		this.numeroCuenta = row.numeroCuenta ?? "";
		this.codigoDelegacion = row.codigoDelegacion ?? "";
		this.numeroRecibo = row.numeroRecibo ?? 0;
		this.importeCobro = row.importeCobro ?? 0;
		this.fechaCobro = row.fechaCobro ?? null;
		this.codigoBarras = row.codigoBarras ?? "";
		this.observacion = row.observacion ?? "";
	}

}
