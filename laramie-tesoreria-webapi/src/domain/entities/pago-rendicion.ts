export default class PagoRendicion {

    id: number;
	idPagoRendicionLote: number;
	idCuentaPago: number;
	codigoDelegacion: string;
	numeroRecibo: number;
	codigoLugarPago: string;
	importePago: number;
	fechaPago: Date;
	codigoBarras: string;

	constructor(
        id: number = 0,
		idPagoRendicionLote: number = 0,
		idCuentaPago: number = 0,
		codigoDelegacion: string = "",
		numeroRecibo: number = 0,
		codigoLugarPago: string = "",
		importePago: number = 0,
		fechaPago: Date = null,
		codigoBarras: string = ""
	)
	{
        this.id = id;
		this.idPagoRendicionLote = idPagoRendicionLote;
		this.idCuentaPago = idCuentaPago;
		this.codigoDelegacion = codigoDelegacion;
		this.numeroRecibo = numeroRecibo;
		this.codigoLugarPago = codigoLugarPago;
		this.importePago = importePago;
		this.fechaPago = fechaPago;
		this.codigoBarras = codigoBarras;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPagoRendicionLote = row.idPagoRendicionLote ?? 0;
		this.idCuentaPago = row.idCuentaPago ?? 0;
		this.codigoDelegacion = row.codigoDelegacion ?? "";
		this.numeroRecibo = row.numeroRecibo ?? 0;
		this.codigoLugarPago = row.codigoLugarPago ?? "";
		this.importePago = row.importePago ?? 0;
		this.fechaPago = row.fechaPago ?? null;
		this.codigoBarras = row.codigoBarras ?? "";
	}

}
