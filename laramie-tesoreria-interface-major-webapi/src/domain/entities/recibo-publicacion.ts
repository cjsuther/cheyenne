import ReciboApertura from "./recibo-apertura";

export default class ReciboPublicacion {

	idCuentaPago: number;
	codigoTipoTributo: string;
	numeroCuenta: string;
	codigoDelegacion: string;
	numeroRecibo: number;
	periodo: string;
	cuota: number;
	importeVencimiento1: number;
	importeVencimiento2: number;
	fechaVencimiento1: Date;
	fechaVencimiento2: Date;
	codigoBarras: string;
	recibosApertura: Array<ReciboApertura>;

	constructor(
		idCuentaPago: number = 0,
		codigoTipoTributo: string = "",
		numeroCuenta: string = "",
		codigoDelegacion: string = "",
		numeroRecibo: number = 0,
		periodo: string = "",
		cuota: number = 0,
		importeVencimiento1: number = 0,
		importeVencimiento2: number = 0,
		fechaVencimiento1: Date = null,
		fechaVencimiento2: Date = null,
		codigoBarras: string = "",
		recibosApertura: Array<ReciboApertura> = []
	)
	{
		this.idCuentaPago = idCuentaPago;
		this.codigoTipoTributo = codigoTipoTributo;
		this.numeroCuenta = numeroCuenta;
		this.codigoDelegacion = codigoDelegacion;
		this.numeroRecibo = numeroRecibo;
		this.periodo = periodo;
		this.cuota = cuota;
		this.importeVencimiento1 = importeVencimiento1;
		this.importeVencimiento2 = importeVencimiento2;
		this.fechaVencimiento1 = fechaVencimiento1;
		this.fechaVencimiento2 = fechaVencimiento2;
		this.codigoBarras = codigoBarras;
		this.recibosApertura = recibosApertura;
	}

	setFromObject = (row) =>
	{
		this.idCuentaPago = row.idCuentaPago ?? 0;
		this.codigoTipoTributo = row.codigoTipoTributo ?? "";
		this.numeroCuenta = row.numeroCuenta ?? "";
		this.codigoDelegacion = row.codigoDelegacion ?? "";
		this.numeroRecibo = row.numeroRecibo ?? 0;
		this.periodo = row.periodo ?? "";
		this.cuota = row.cuota ?? 0;
		this.importeVencimiento1 = row.importeVencimiento1 ?? 0;
		this.importeVencimiento2 = row.importeVencimiento2 ?? 0;
		this.fechaVencimiento1 = row.fechaVencimiento1 ?? null;
		this.fechaVencimiento2 = row.fechaVencimiento2 ?? null;
		this.codigoBarras = row.codigoBarras ?? "";
		this.recibosApertura = (row.recibosApertura) ? row.recibosApertura.map(x => {
            let item = new ReciboApertura();
            item.setFromObject(x);
            return item;
        }) : [];
	}

}
