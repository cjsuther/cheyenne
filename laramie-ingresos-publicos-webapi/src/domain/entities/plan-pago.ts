import TipoPlanPago from "./tipo-plan-pago";

export default class PlanPago {

    id: number;
	idTipoPlanPago: number;
	idTipoTributo: number;
	idSubTasaPlanPago: number;
	idSubTasaInteres: number;
	idSubTasaSellados: number;
	idSubTasaGastosCausidicos: number;
	codigo: string;
	descripcion: string;
	numero: number;
	idPlanPagoDefinicion: number;
	idTributo: number;
	idCuenta: number;
	idTipoVinculoCuenta: number;
	idVinculoCuenta: number;
	importeNominal: number;
    importeAccesorios: number;
	importeCapital: number;
	importeIntereses: number;
	importeSellados: number;
	importeGastosCausidicos: number;
	importeQuita: number;
	importeQuitaDevengar: number;
	importePlanPago: number;
	idUsuarioFirmante: number;
	idUsuarioRegistro: number;
	fechaRegistro: Date;

	tipoPlanPago: TipoPlanPago;

	constructor(
        id: number = 0,
		idTipoPlanPago: number = 0,
		idTipoTributo: number = 0,
		idSubTasaPlanPago: number = 0,
		idSubTasaInteres: number = 0,
		idSubTasaSellados: number = 0,
		idSubTasaGastosCausidicos: number = 0,
		codigo: string = "",
		descripcion: string = "",
		numero: number = 0,
		idPlanPagoDefinicion: number = 0,
		idTributo: number = 0,
		idCuenta: number = 0,
		idTipoVinculoCuenta: number = 0,
		idVinculoCuenta: number = 0,
		importeNominal: number = 0,
		importeAccesorios: number = 0, 
		importeCapital: number = 0,
		importeIntereses: number = 0,
		importeSellados: number = 0,
		importeGastosCausidicos: number = 0,
		importeQuita: number = 0,
		importeQuitaDevengar: number = 0,
		importePlanPago: number = 0,
		idUsuarioFirmante: number = 0,
		idUsuarioRegistro: number = 0,
		fechaRegistro: Date = null,
		tipoPlanPago: TipoPlanPago = null
	)
	{
        this.id = id;
		this.idTipoPlanPago = idTipoPlanPago;
		this.idTipoTributo = idTipoTributo;
		this.idSubTasaPlanPago = idSubTasaPlanPago;
		this.idSubTasaInteres = idSubTasaInteres;
		this.idSubTasaSellados = idSubTasaSellados;
		this.idSubTasaGastosCausidicos = idSubTasaGastosCausidicos;
		this.codigo = codigo;
		this.descripcion = descripcion;
		this.numero = numero;
		this.idPlanPagoDefinicion = idPlanPagoDefinicion;
		this.idTributo = idTributo;
		this.idCuenta = idCuenta;
		this.idTipoVinculoCuenta = idTipoVinculoCuenta;
		this.idVinculoCuenta = idVinculoCuenta;
		this.importeNominal = importeNominal;
		this.importeAccesorios = importeAccesorios;
		this.importeCapital = importeCapital;
		this.importeIntereses = importeIntereses;
		this.importeSellados = importeSellados;
		this.importeGastosCausidicos = importeGastosCausidicos;
		this.importeQuita = importeQuita;
		this.importeQuitaDevengar = importeQuitaDevengar;
		this.importePlanPago = importePlanPago;
		this.idUsuarioFirmante = idUsuarioFirmante;
		this.idUsuarioRegistro = idUsuarioRegistro;
		this.fechaRegistro = fechaRegistro;
		this.tipoPlanPago = tipoPlanPago;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idTipoPlanPago = row.idTipoPlanPago ?? 0;
		this.idTipoTributo = row.idTipoTributo ?? 0;
		this.idSubTasaPlanPago = row.idSubTasaPlanPago ?? 0;
		this.idSubTasaInteres = row.idSubTasaInteres ?? 0;
		this.idSubTasaSellados = row.idSubTasaSellados ?? 0;
		this.idSubTasaGastosCausidicos = row.idSubTasaGastosCausidicos ?? 0;
		this.codigo = row.codigo ?? "";
		this.descripcion = row.descripcion ?? "";
		this.numero = row.numero ?? 0;
		this.idPlanPagoDefinicion = row.idPlanPagoDefinicion ?? 0;
		this.idTributo = row.idTributo ?? 0;
		this.idCuenta = row.idCuenta ?? 0;
		this.idTipoVinculoCuenta = row.idTipoVinculoCuenta ?? 0;
		this.idVinculoCuenta = row.idVinculoCuenta ?? 0;
		this.importeNominal = row.importeNominal ?? 0;
		this.importeCapital = row.importeCapital ?? 0;
		this.importeAccesorios = row.importeAccesorios ?? 0;
		this.importeIntereses = row.importeIntereses ?? 0;
		this.importeSellados = row.importeSellados ?? 0;
		this.importeGastosCausidicos = row.importeGastosCausidicos ?? 0;
		this.importeQuita = row.importeQuita ?? 0;
		this.importeQuitaDevengar = row.importeQuitaDevengar ?? 0;
		this.importePlanPago = row.importePlanPago ?? 0;
		this.idUsuarioFirmante = row.idUsuarioFirmante ?? 0;
		this.idUsuarioRegistro = row.idUsuarioRegistro ?? 0;
		this.fechaRegistro = row.fechaRegistro ?? null;
		this.tipoPlanPago = row.tipoPlanPago ?? null;
	}

}
