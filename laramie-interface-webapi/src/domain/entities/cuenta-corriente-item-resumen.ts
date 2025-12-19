export default class CuentaCorrienteItemResumen {

	idSolicitud: number;
	numeroCuenta: string;
	codigoTasa: string;
	nombreTasa: string;
	codigoSubTasa: string;
	nombreSubTasa: string;
	descripcionTasa: string;
	numeroPartida: number;
	periodo: string;
	cuota: number;
	importeSaldo: number;
	fechaVencimiento: Date;

	constructor(
		idSolicitud: number = 0,
		numeroCuenta: string = "",
		codigoTasa: string = "",
		nombreTasa: string = "",
		codigoSubTasa: string = "",
		nombreSubTasa: string = "",
		descripcionTasa: string = "",
		numeroPartida: number = 0,
		periodo: string = "",
		cuota: number = 0,
		importeSaldo: number = 0,
		fechaVencimiento: Date = null
	)
	{
		this.idSolicitud = idSolicitud;
		this.numeroCuenta = numeroCuenta;
		this.codigoTasa = codigoTasa;
		this.nombreTasa = nombreTasa;
		this.codigoSubTasa = codigoSubTasa;
		this.nombreSubTasa = nombreSubTasa;
		this.descripcionTasa = descripcionTasa;
		this.numeroPartida = numeroPartida;
		this.periodo = periodo;
		this.cuota = cuota;
		this.importeSaldo = importeSaldo;
		this.fechaVencimiento = fechaVencimiento;
	}

	setFromObject = (row) =>
	{
		this.idSolicitud = row.idSolicitud ?? 0;
		this.numeroCuenta = row.numeroCuenta ?? "";
		this.codigoTasa = row.codigoTasa ?? "";
		this.nombreTasa = row.nombreTasa ?? "";
		this.codigoSubTasa = row.codigoSubTasa ?? "";
		this.nombreSubTasa = row.nombreSubTasa ?? "";
		this.descripcionTasa = row.descripcionTasa ?? "";
		this.numeroPartida = row.numeroPartida ?? 0;
		this.periodo = row.periodo ?? "";
		this.cuota = row.cuota ?? 0;
		this.importeSaldo = row.importeSaldo ?? 0;
		this.fechaVencimiento = row.fechaVencimiento ?? null;
	}

}
