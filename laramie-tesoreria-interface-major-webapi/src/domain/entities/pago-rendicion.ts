import ReciboApertura from "./recibo-apertura";

export default class PagoRendicion {

	idCuentaPago: number;
	codigoDelegacion: string;
	numeroRecibo: number;
	codigoLugarPago: string;
	importePago: number;
	fechaPago: Date;
	idUsuarioProceso: number;
	fechaProceso: Date;
	codigoBarras: string;
	recibosApertura: Array<ReciboApertura>;

	constructor(
		idCuentaPago: number = 0,
		codigoDelegacion: string = "",
		numeroRecibo: number = 0,
		codigoLugarPago: string = "",
		importePago: number = 0,
		fechaPago: Date = null,
		idUsuarioProceso: number = 0,
		fechaProceso: Date = null,
		codigoBarras: string = "",
		recibosApertura: Array<ReciboApertura> = []
	)
	{
        this.idCuentaPago = idCuentaPago;
		this.codigoDelegacion = codigoDelegacion;
		this.numeroRecibo = numeroRecibo;
        this.codigoLugarPago = codigoLugarPago;
        this.importePago = importePago;
        this.fechaPago = fechaPago;
		this.idUsuarioProceso = idUsuarioProceso;
        this.fechaProceso = fechaProceso;
        this.codigoBarras = codigoBarras;
		this.recibosApertura = recibosApertura;
	}

	setFromObject = (row) =>
	{
		this.idCuentaPago = row.idCuentaPago ?? 0;
		this.codigoDelegacion = row.codigoDelegacion ?? "";
		this.numeroRecibo = row.numeroRecibo ?? 0;
		this.codigoLugarPago = row.codigoLugarPago ?? "";
		this.importePago = row.importePago ?? 0;
		this.fechaPago = row.fechaPago ?? null;
		this.idUsuarioProceso = row.idUsuarioProceso ?? 0;
		this.fechaProceso = row.fechaProceso ?? null;
		this.codigoBarras = row.codigoBarras ?? "";
		this.recibosApertura = (row.recibosApertura) ? row.recibosApertura.map(x => {
			let item = new ReciboApertura();
			item.setFromObject(x);
			return item;
		}) : [];
	}

}
