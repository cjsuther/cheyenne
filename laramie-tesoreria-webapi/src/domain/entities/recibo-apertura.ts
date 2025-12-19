export default class ReciboApertura {

    id: number;
	idReciboPublicacion: number;
	codigoRubro: string;
	codigoTasa: string;
	codigoSubTasa: string;
	codigoTipoMovimiento: string;
	periodo: string;
	cuota: number;
	importeCancelar: number;
	importeImputacionContable: number;
	numeroCertificadoApremio: string;
	vencimiento: number;
	fechaVencimiento: Date;
	numeroEmision: string;
	tipoNovedad: string;

	constructor(
        id: number = 0,
		idReciboPublicacion: number = 0,
		codigoRubro: string = "",
		codigoTasa: string = "",
		codigoSubTasa: string = "",
		codigoTipoMovimiento: string = "",
		periodo: string = "",
		cuota: number = 0,
		importeCancelar: number = 0,
		importeImputacionContable: number = 0,
		numeroCertificadoApremio: string = "",
		vencimiento: number = 0,
		fechaVencimiento: Date = null,
		numeroEmision: string = "",
		tipoNovedad: string = ""
	)
	{
        this.id = id;
		this.idReciboPublicacion = idReciboPublicacion;
		this.codigoRubro = codigoRubro;
		this.codigoTasa = codigoTasa;
		this.codigoSubTasa = codigoSubTasa;
		this.codigoTipoMovimiento = codigoTipoMovimiento;
		this.periodo = periodo;
		this.cuota = cuota;
		this.importeCancelar = importeCancelar;
		this.importeImputacionContable = importeImputacionContable;
		this.numeroCertificadoApremio = numeroCertificadoApremio;
		this.vencimiento = vencimiento;
		this.fechaVencimiento = fechaVencimiento;
		this.numeroEmision = numeroEmision;
		this.tipoNovedad = tipoNovedad;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? null;
		this.idReciboPublicacion = row.idReciboPublicacion ?? null;
		this.codigoRubro = row.codigoRubro ?? "";
		this.codigoTasa = row.codigoTasa ?? "";
		this.codigoSubTasa = row.codigoSubTasa ?? "";
		this.codigoTipoMovimiento = row.codigoTipoMovimiento ?? "";
		this.periodo = row.periodoImputacion ?? "";
		this.cuota = row.cuota ?? 0;
		this.importeCancelar = row.importeCancelar ?? 0;
		this.importeImputacionContable = row.importeImputacionContable ?? 0;
		this.numeroCertificadoApremio = row.numeroCertificadoApremio ?? "";
		this.vencimiento = row.vencimiento ?? 0;
		this.fechaVencimiento = row.fechaVencimiento ? new Date(row.fechaVencimiento) : null;
		this.numeroEmision = row.numeroEmision ?? "";
		this.tipoNovedad = row.tipoNovedad ?? "";
	}

}
