import CodigoBarrasCliente from "./codigo-barras-cliente";
import ReciboApertura from "./recibo-apertura";

export default class ReciboPublicacion {

    id: number;
	idReciboPublicacionLote: number;
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
	idPagoRendicion: number;

	recibosApertura: ReciboApertura[];
	codigosBarrasCliente: CodigoBarrasCliente[];

	constructor(
        id: number = 0,
		idReciboPublicacionLote: number = 0,
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
		idPagoRendicion: number = 0
	)
	{
        this.id = id;
		this.idReciboPublicacionLote = idReciboPublicacionLote;
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
		this.idPagoRendicion = idPagoRendicion;
		this.recibosApertura = [];
		this.codigosBarrasCliente = [];
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? null;
		this.idReciboPublicacionLote = row.idReciboPublicacionLote ?? null;
		this.idCuentaPago = row.idCuentaPago ?? null;
		this.codigoTipoTributo = row.codigoTipoTributo ?? "";
		this.numeroCuenta = row.numeroCuenta ?? "";
		this.codigoDelegacion = row.codigoDelegacion ?? "";
		this.numeroRecibo = row.numeroRecibo ?? 0;
		this.periodo = row.periodo ?? "";
		this.cuota = row.cuota ?? 0;
		this.importeVencimiento1 = row.importeVencimiento1 ?? 0;
		this.importeVencimiento2 = row.importeVencimiento2 ?? 0;
		this.fechaVencimiento1 = row.fechaVencimiento1 ? new Date(row.fechaVencimiento1) : null;
		this.fechaVencimiento2 = row.fechaVencimiento2 ? new Date(row.fechaVencimiento2) : null;
		this.codigoBarras = row.codigoBarras ?? "";
		this.idPagoRendicion = row.idPagoRendicion ?? null;
		this.recibosApertura = (row.recibosApertura) ? row.recibosApertura.map(x => {
            let item = new ReciboApertura();
            item.setFromObject(x);
            return item;
        }) : [];
		this.codigosBarrasCliente = (row.codigosBarrasCliente) ? row.codigosBarrasCliente.map(x => {
            let item = new CodigoBarrasCliente();
            item.setFromObject(x);
            return item;
        }) : [];
	}

}
