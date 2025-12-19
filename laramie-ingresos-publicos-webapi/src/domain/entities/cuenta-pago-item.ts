export default class CuentaPagoItem {

    id: number;
	idEmisionEjecucion: number;
	idEmisionConceptoResultado: number;
	idPlanPagoCuota: number;
	idCuentaPago: number;
	idCuenta: number;
	idTasa: number;
	idSubTasa: number;
	periodo: string;
	cuota: number;
	importeNominal: number;
	importeAccesorios: number;
	importeRecargos: number;
	importeMultas: number;
	importeHonorarios: number;
	importeAportes: number;
	importeTotal: number;
	importeNeto: number;
	importeDescuento: number;
	fechaVencimientoTermino: Date;
	fechaCobro: Date;
	idEdesurCliente: number;
	item: number;
	numeroPartida: number;

	constructor(
        id: number = 0,
		idEmisionEjecucion: number = 0,
		idEmisionConceptoResultado: number = 0,
		idPlanPagoCuota: number = 0,
		idCuentaPago: number = 0,
		idCuenta: number = 0,
		idTasa: number = 0,
		idSubTasa: number = 0,
		periodo: string = "",
		cuota: number = 0,
		importeNominal: number = 0,
		importeAccesorios: number = 0,
		importeRecargos: number = 0,
		importeMultas: number = 0,
		importeHonorarios: number = 0,
		importeAportes: number = 0,
		importeTotal: number = 0,
		importeNeto: number = 0,
		importeDescuento: number = 0,
		fechaVencimientoTermino: Date = null,
		fechaCobro: Date = null,
		idEdesurCliente: number = 0,
		item: number = 0,
		numeroPartida: number = 0
	)
	{
        this.id = id;
		this.idEmisionEjecucion = idEmisionEjecucion;
		this.idEmisionConceptoResultado = idEmisionConceptoResultado;
		this.idPlanPagoCuota = idPlanPagoCuota;
		this.idCuentaPago = idCuentaPago;
		this.idCuenta = idCuenta;
		this.idTasa = idTasa;
		this.idSubTasa = idSubTasa;
		this.periodo = periodo;
		this.cuota = cuota;
		this.importeNominal = importeNominal;
		this.importeAccesorios = importeAccesorios;
		this.importeRecargos = importeRecargos;
		this.importeMultas = importeMultas;
		this.importeHonorarios = importeHonorarios;
		this.importeAportes = importeAportes;		
		this.importeTotal = importeTotal;
		this.importeNeto = importeNeto;
		this.importeDescuento = importeDescuento;
		this.fechaVencimientoTermino = fechaVencimientoTermino;
		this.fechaCobro = fechaCobro;
		this.idEdesurCliente = idEdesurCliente;
		this.item = item;
		this.numeroPartida = numeroPartida;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idEmisionEjecucion = row.idEmisionEjecucion ?? 0;
		this.idEmisionConceptoResultado = row.idEmisionConceptoResultado ?? 0;
		this.idPlanPagoCuota = row.idPlanPagoCuota ?? 0;
		this.idCuentaPago = row.idCuentaPago ?? 0;
		this.idCuenta = row.idCuenta ?? 0;
		this.idTasa = row.idTasa ?? 0;
		this.idSubTasa = row.idSubTasa ?? 0;
		this.periodo = row.periodo ?? "";
		this.cuota = row.cuota ?? 0;
		this.importeNominal = row.importeNominal ?? 0;
		this.importeAccesorios = row.importeAccesorios ?? 0;
		this.importeRecargos = row.importeRecargos ?? 0;
		this.importeMultas = row.importeMultas ?? 0;
		this.importeHonorarios = row.importeHonorarios ?? 0;
		this.importeAportes = row.importeAportes ?? 0;
		this.importeTotal = row.importeTotal ?? 0;
		this.importeNeto = row.importeNeto ?? 0;
		this.importeDescuento = row.importeDescuento ?? 0;
		this.fechaVencimientoTermino = row.fechaVencimientoTermino ?? null;
		this.fechaCobro = row.fechaCobro ?? null;
		this.idEdesurCliente = row.idEdesurCliente ?? 0;
		this.item = row.item ?? 0;
		this.numeroPartida = row.numeroPartida ?? 0;
	}

}
