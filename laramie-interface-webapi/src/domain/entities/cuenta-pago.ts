export default class CuentaPago {

    id: number;
	idEmisionEjecucion: number;
	idPlanPago: number;
	idCuenta: number;
	codigoDelegacion: string;
	numeroRecibo: number;
	periodo: string;
	cuota: number;
	importeVencimiento1: number;
	importeVencimiento2: number;
	fechaVencimiento1: Date;
	fechaVencimiento2: Date;
	codigoBarras: string;
	pagoAnticipado: boolean;
	reciboEspecial: boolean;

	constructor(
        id: number = 0,
		idEmisionEjecucion: number = 0,
		idPlanPago: number = 0,
		idCuenta: number = 0,
		codigoDelegacion: string = "",
		numeroRecibo: number = 0,
		periodo: string = "",
		cuota: number = 0,
		importeVencimiento1: number = 0,
		importeVencimiento2: number = 0,
		fechaVencimiento1: Date = null,
		fechaVencimiento2: Date = null,
		codigoBarras: string = "",
		pagoAnticipado: boolean = false,
		reciboEspecial: boolean = false
	)
	{
        this.id = id;
		this.idEmisionEjecucion = idEmisionEjecucion;
		this.idPlanPago = idPlanPago;
		this.idCuenta = idCuenta;
		this.codigoDelegacion = codigoDelegacion;
		this.numeroRecibo = numeroRecibo;
		this.periodo = periodo;
		this.cuota = cuota;
		this.importeVencimiento1 = importeVencimiento1;
		this.importeVencimiento2 = importeVencimiento2;
		this.fechaVencimiento1 = fechaVencimiento1;
		this.fechaVencimiento2 = fechaVencimiento2;
		this.codigoBarras = codigoBarras;
		this.pagoAnticipado = pagoAnticipado;
		this.reciboEspecial = reciboEspecial;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idEmisionEjecucion = row.idEmisionEjecucion ?? 0;
		this.idPlanPago = row.idPlanPago ?? 0;
		this.idCuenta = row.idCuenta ?? 0;
		this.codigoDelegacion = row.codigoDelegacion ?? "";
		this.numeroRecibo = row.numeroRecibo ?? 0;
		this.periodo = row.periodo ?? "";
		this.cuota = row.cuota ?? 0;
		this.importeVencimiento1 = row.importeVencimiento1 ?? 0;
		this.importeVencimiento2 = row.importeVencimiento2 ?? 0;
		this.fechaVencimiento1 = row.fechaVencimiento1 ?? null;
		this.fechaVencimiento2 = row.fechaVencimiento2 ?? null;
		this.codigoBarras = row.codigoBarras;
		this.pagoAnticipado = row.pagoAnticipado;
		this.reciboEspecial = row.reciboEspecial;
	}

}
