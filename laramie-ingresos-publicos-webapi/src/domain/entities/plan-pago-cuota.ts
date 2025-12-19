export default class PlanPagoCuota {

    id: number;
	idPlanPago: number;
	idEstadoPlanPagoCuota: number;
	esAnticipo: boolean;
	numero: number;
	importeCapital: number;
	importeIntereses: number;
	importeSellados: number;
	importeGastosCausidicos: number;
	importeCuota: number;
	fechaVencimiento: Date;
	fechaPagado: Date;

	constructor(
        id: number = 0,
		idPlanPago: number = 0,
		idEstadoPlanPagoCuota: number = 0,
		esAnticipo: boolean = false,
		numero: number = 0,
		importeCapital: number = 0,
		importeIntereses: number = 0,
		importeSellados: number = 0,
		importeGastosCausidicos: number = 0,
		importeCuota: number = 0,
		fechaVencimiento: Date = null,
		fechaPagado: Date = null
	)
	{
        this.id = id;
		this.idPlanPago = idPlanPago;
		this.idEstadoPlanPagoCuota = idEstadoPlanPagoCuota;
		this.esAnticipo = esAnticipo;
		this.numero = numero;
		this.importeCapital = importeCapital;
		this.importeIntereses = importeIntereses;
		this.importeSellados = importeSellados;
		this.importeGastosCausidicos = importeGastosCausidicos;
		this.importeCuota = importeCuota;
		this.fechaVencimiento = fechaVencimiento;
		this.fechaPagado = fechaPagado;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPlanPago = row.idPlanPago ?? 0;
		this.idEstadoPlanPagoCuota = row.idEstadoPlanPagoCuota ?? 0;
		this.esAnticipo = row.esAnticipo ?? false;
		this.numero = row.numero ?? 0;
		this.importeCapital = row.importeCapital ?? 0;
		this.importeIntereses = row.importeIntereses ?? 0;
		this.importeSellados = row.importeSellados ?? 0;
		this.importeGastosCausidicos = row.importeGastosCausidicos ?? 0;
		this.importeCuota = row.importeCuota ?? 0;
		this.fechaVencimiento = row.fechaVencimiento ?? null;
		this.fechaPagado = row.fechaPagado ?? null;
	}

}
