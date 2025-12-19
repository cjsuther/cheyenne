export default class CuentaCorrienteItemDeuda {

	indexMovimiento: number;
	idCertificadoApremio: number;
	idCuenta: number;
	idTasa: number;
	idSubTasa: number;
	codigoDelegacion: string;
	numeroMovimiento: number;
	numeroPartida: number;
	tasaCabecera: boolean;
	periodo: string;
	cuota: number;
	importeSaldo: number;
    importeMultas: number;
	importeRecargos: number;
	importeHonorarios: number;
	importeAportes: number;
	importeAccesorios: number;
	importeTotal: number;
	importeACancelar: number;
	fechaMovimiento: Date;
	fechaVencimiento1: Date;
	fechaVencimiento2: Date;
	esPlanPago: boolean;

	constructor(
		indexMovimiento: number = 0,
		idCertificadoApremio: number = 0,
		idCuenta: number = 0,
		idTasa: number = 0,
		idSubTasa: number = 0,
		codigoDelegacion: string = "",
		numeroMovimiento: number = 0,
		numeroPartida: number = 0,
		tasaCabecera: boolean = false,
		periodo: string = "",
		cuota: number = 0,
		importeSaldo: number = 0,
		importeMultas: number = 0,
		importeRecargos: number = 0,
		importeHonorarios: number = 0,
		importeAportes: number = 0,
		importeAccesorios: number = 0,
		importeTotal: number = 0,
		importeACancelar: number = 0,
		fechaMovimiento: Date = null,
		fechaVencimiento1: Date = null,
		fechaVencimiento2: Date = null,
		esPlanPago: boolean = false
	)
	{
		this.indexMovimiento = indexMovimiento;
		this.idCertificadoApremio = idCertificadoApremio;
		this.idCuenta = idCuenta;
		this.idTasa = idTasa;
		this.idSubTasa = idSubTasa;
		this.codigoDelegacion = codigoDelegacion;
		this.numeroMovimiento = numeroMovimiento;
		this.numeroPartida = numeroPartida;
		this.tasaCabecera = tasaCabecera;
		this.periodo = periodo;
		this.cuota = cuota;
		this.importeSaldo = importeSaldo;
		this.importeMultas = importeMultas;
		this.importeRecargos = importeRecargos;
		this.importeHonorarios = importeHonorarios;
		this.importeAportes = importeAportes;
		this.importeAccesorios = importeAccesorios;
		this.importeTotal = importeTotal;
		this.importeACancelar = importeACancelar;
		this.fechaMovimiento = fechaMovimiento;
		this.fechaVencimiento1 = fechaVencimiento1;
		this.fechaVencimiento2 = fechaVencimiento2;
		this.esPlanPago = esPlanPago;
	}

	setFromObject = (row) =>
	{
		this.indexMovimiento = row.indexMovimiento ?? 0;
		this.idCertificadoApremio = row.idCertificadoApremio ?? 0;
		this.idCuenta = row.idCuenta ?? 0;
		this.idTasa = row.idTasa ?? 0;
		this.idSubTasa = row.idSubTasa ?? 0;
		this.codigoDelegacion = row.codigoDelegacion ?? "";
		this.numeroMovimiento = row.numeroMovimiento ?? 0;
		this.numeroPartida = row.numeroPartida ?? 0;
		this.tasaCabecera = row.tasaCabecera ?? false;
		this.periodo = row.periodo ?? "";
		this.cuota = row.cuota ?? 0;
		this.importeSaldo = row.importeSaldo ?? 0;
		this.importeMultas = row.importeMultas ?? 0;
		this.importeRecargos = row.importeRecargos ?? 0;
		this.importeHonorarios = row.importeHonorarios ?? 0;
		this.importeAportes = row.importeAportes ?? 0;
		this.importeAccesorios = row.importeAccesorios ?? 0;
		this.importeTotal = row.importeTotal ?? 0;
		this.importeACancelar = row.importeACancelar ?? 0;
		this.fechaMovimiento = row.fechaMovimiento ?? null;
		this.fechaVencimiento1 = row.fechaVencimiento1 ?? null;
		this.fechaVencimiento2 = row.fechaVencimiento2 ?? null;
		this.esPlanPago = row.esPlanPago ?? false;
	}

}
