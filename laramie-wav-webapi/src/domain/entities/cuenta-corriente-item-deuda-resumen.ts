export default class CuentaCorrienteItemDeudaResumen {

	idCuenta: number;
	idTasa: number;
	codigoTasa: string;
	nombreTasa: string;
	idSubTasa: number;
	codigoSubTasa: string;
	nombreSubTasa: string;
	descripcionTasa: string;
	numeroPartida: number;
	periodo: string;
	cuota: number;
	importeSaldo: number;
	importeAccesorios: number;
	importeTotal: number;
	importeCreditoAplicable: number;
	importeCreditoRetencionAplicable: number;
	fechaVencimiento: Date;
	tieneDeudaVencida: boolean;
	tieneDeudaJudicial: boolean;
	tieneInhibicion: boolean;
	esPlanPago: boolean;
	idPasarela: number;

	constructor(
		idCuenta: number = 0,
		idTasa: number = 0,
		codigoTasa: string = "",
		nombreTasa: string = "",
		idSubTasa: number = 0,
		codigoSubTasa: string = "",
		nombreSubTasa: string = "",
		descripcionTasa: string = "",
		numeroPartida: number = 0,
		periodo: string = "",
		cuota: number = 0,
		importeSaldo: number = 0,
		importeAccesorios: number = 0,
		importeTotal: number = 0,
		importeCreditoAplicable: number = 0,
		importeCreditoRetencionAplicable: number = 0,
		fechaVencimiento: Date = null,
		tieneDeudaVencida: boolean = false,
		tieneDeudaJudicial: boolean = false,
		tieneInhibicion: boolean = false,
		esPlanPago: boolean = false,
		idPasarela: number = 0
	)
	{
		this.idCuenta = idCuenta;
		this.idTasa = idTasa;
		this.codigoTasa = codigoTasa;
		this.nombreTasa = nombreTasa;
		this.idSubTasa = idSubTasa;
		this.codigoSubTasa = codigoSubTasa;
		this.nombreSubTasa = nombreSubTasa;
		this.descripcionTasa = descripcionTasa;
		this.numeroPartida = numeroPartida;
		this.periodo = periodo;
		this.cuota = cuota;
		this.importeSaldo = importeSaldo;
		this.importeAccesorios = importeAccesorios;
		this.importeTotal = importeTotal;
		this.importeCreditoAplicable = importeCreditoAplicable;
		this.importeCreditoRetencionAplicable = importeCreditoRetencionAplicable;
		this.fechaVencimiento = fechaVencimiento;
		this.tieneDeudaVencida = tieneDeudaVencida;
		this.tieneDeudaJudicial = tieneDeudaJudicial;
		this.tieneInhibicion = tieneInhibicion;
		this.esPlanPago = esPlanPago;
		this.idPasarela = idPasarela;
	}

	setFromObject = (row) =>
	{
		this.idCuenta = row.idCuenta ?? 0;
		this.idTasa = row.idTasa ?? 0;
		this.codigoTasa = row.codigoTasa ?? "";
		this.nombreTasa = row.nombreTasa ?? "";
		this.idSubTasa = row.idSubTasa ?? 0;
		this.codigoSubTasa = row.codigoSubTasa ?? "";
		this.nombreSubTasa = row.nombreSubTasa ?? "";
		this.descripcionTasa = row.descripcionTasa ?? "";
		this.numeroPartida = row.numeroPartida ?? 0;
		this.periodo = row.periodo ?? "";
		this.cuota = row.cuota ?? 0;
		this.importeSaldo = row.importeSaldo ?? 0;
		this.importeAccesorios = row.importeAccesorios ?? 0;
		this.importeTotal = row.importeTotal ?? 0;
		this.importeCreditoAplicable = row.importeCreditoAplicable ?? 0;
		this.importeCreditoRetencionAplicable = row.importeCreditoRetencionAplicable ?? 0;
		this.fechaVencimiento = row.fechaVencimiento ?? null;
		this.tieneDeudaVencida = row.tieneDeudaVencida ?? false;
		this.tieneDeudaJudicial = row.tieneDeudaJudicial ?? false;
		this.tieneInhibicion = row.tieneInhibicion ?? false;
		this.esPlanPago = row.esPlanPago ?? false;
		this.idPasarela = row.idPasarela ?? 0;
	}

}
