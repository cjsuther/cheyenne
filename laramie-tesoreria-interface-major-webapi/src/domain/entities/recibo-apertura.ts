export default class ReciboApertura {

	codigoRubro: string;
	codigoTasa: string;
	codigoSubTasa: string;
	codigoTipoMovimiento: string;
	periodo: string;
	cuota: number;
	importeCancelar: number;
	importeImputacionContable: number;
	ejercicio: string;
	periodoImputacion: string;
	item: number;
	codigoEdesurCliente: string;
	numeroCertificadoApremio: string;
	vencimiento: number;
	fechaVencimiento: Date;
	numeroEmision: string;
	tipoNovedad: string;

	constructor(
		codigoRubro: string = "",
		codigoTasa: string = "",
		codigoSubTasa: string = "",
		codigoTipoMovimiento: string = "",
		periodo: string = "",
		cuota: number = 0,
		importeCancelar: number = 0,
		importeImputacionContable: number = 0,
		ejercicio: string = "",
		periodoImputacion: string = "",
		item: number = 0,
		codigoEdesurCliente: string = "",
		numeroCertificadoApremio: string = "",
		vencimiento: number = 0,
		fechaVencimiento: Date = null,
		numeroEmision: string = "",
		tipoNovedad: string = ""
	)
	{
		this.codigoRubro = codigoRubro;
		this.codigoTasa = codigoTasa;
		this.codigoSubTasa = codigoSubTasa;
		this.codigoTipoMovimiento = codigoTipoMovimiento;
		this.periodo = periodo;
		this.cuota = cuota;
		this.importeCancelar = importeCancelar;
		this.importeImputacionContable = importeImputacionContable;
		this.ejercicio = ejercicio;
		this.periodoImputacion = periodoImputacion;
		this.item = item;
		this.codigoEdesurCliente = codigoEdesurCliente;
		this.numeroCertificadoApremio = numeroCertificadoApremio;
		this.vencimiento = vencimiento;
		this.fechaVencimiento = fechaVencimiento;
		this.numeroEmision = numeroEmision;
		this.tipoNovedad = tipoNovedad;
	}

	setFromObject = (row) =>
	{
		this.codigoRubro = row.codigoRubro ?? "";
		this.codigoTasa = row.codigoTasa ?? "";
		this.codigoSubTasa = row.codigoSubTasa ?? "";
		this.codigoTipoMovimiento = row.codigoTipoMovimiento ?? "";
		this.periodo = row.periodo ?? "";
		this.cuota = row.cuota ?? 0;
		this.importeCancelar = row.importeCancelar ?? 0;
		this.importeImputacionContable = row.importeImputacionContable ?? 0;
		this.ejercicio = row.ejercicio ?? "";
		this.periodoImputacion = row.periodoImputacion ?? "";
		this.item = row.item ?? 0;
		this.codigoEdesurCliente = row.codigoEdesurCliente ?? "";
		this.numeroCertificadoApremio = row.numeroCertificadoApremio ?? "";
		this.vencimiento = row.vencimiento ?? 0;
		this.fechaVencimiento = row.fechaVencimiento ?? null;
		this.numeroEmision = row.numeroEmision ?? "";
		this.tipoNovedad = row.tipoNovedad ?? "";
	}

}
