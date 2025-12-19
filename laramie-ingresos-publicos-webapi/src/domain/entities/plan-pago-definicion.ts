import TipoPlanPago from "./tipo-plan-pago";

export default class PlanPagoDefinicion {

    id: number;
	idEstadoPlanPagoDefinicion: number;
	idTipoPlanPago: number;
	idTipoTributo: number;
	idTasaPlanPago: number;
	idSubTasaPlanPago: number;
	idTasaInteres: number;
	idSubTasaInteres: number;
	idTasaSellados: number;
	idSubTasaSellados: number;
	idTasaGastosCausidicos: number;
	idSubTasaGastosCausidicos: number;
	codigo: string;
	descripcion: string;
	fechaDesde: Date;
	fechaHasta: Date;
	tieneAnticipo: boolean;
	cuotaDesde: number;
	cuotaHasta: number;
	peridiocidad: number;
	idTipoVencimientoAnticipo: number;
	idTipoVencimientoCuota1: number;
	idTipoVencimientoCuotas: number;
	porcentajeAnticipo: number;
	idTipoAlcanceTemporal: number;
	fechaDesdeAlcanceTemporal: Date;
	fechaHastaAlcanceTemporal: Date;
	mesDesdeAlcanceTemporal: number;
	mesHastaAlcanceTemporal: number;
	aplicaDerechosEspontaneos: boolean;
	aplicaCancelacionAnticipada: boolean;
	aplicaTotalidadDeudaAdministrativa: boolean;
	aplicaDeudaAdministrativa: boolean;
	aplicaDeudaLegal: boolean;
	aplicaGranContribuyente: boolean;
	aplicaPequenioContribuyente: boolean;
	caducidadAnticipoImpago: boolean;
	caducidadCantidadCuotasConsecutivas: number;
	caducidadCantidadCuotasNoConsecutivas: number;
	caducidadCantidadDiasVencimiento: number;
	caducidadCantidadDeclaracionesJuradas: number;
	montoDeudaAdministrativaDesde: number;
	montoDeudaAdministrativaHasta: number;
	montoCuotaDesde: number;
	montoCuotaHasta: number;
	idTipoCalculoInteres: number;
	idUsuarioCreacion: number;
	fechaCreacion: Date;

	tipoPlanPago: TipoPlanPago;

	constructor(
        id: number = 0,
		idEstadoPlanPagoDefinicion: number = 0,
		idTipoPlanPago: number = 0,
		idTipoTributo: number = 0,
		idTasaPlanPago: number = 0,
		idSubTasaPlanPago: number = 0,
		idTasaInteres: number = 0,
		idSubTasaInteres: number = 0,
		idTasaSellados: number = 0,
		idSubTasaSellados: number = 0,
		idTasaGastosCausidicos: number = 0,
		idSubTasaGastosCausidicos: number = 0,
		codigo: string = "",
		descripcion: string = "",
		fechaDesde: Date = null,
		fechaHasta: Date = null,
		tieneAnticipo: boolean = false,
		cuotaDesde: number = 0,
		cuotaHasta: number = 0,
		peridiocidad: number = 0,
		idTipoVencimientoAnticipo: number = 0,
		idTipoVencimientoCuota1: number = 0,
		idTipoVencimientoCuotas: number = 0,
		porcentajeAnticipo: number = 0,
		idTipoAlcanceTemporal: number = 0,
		fechaDesdeAlcanceTemporal: Date = null,
		fechaHastaAlcanceTemporal: Date = null,
		mesDesdeAlcanceTemporal: number = 0,
		mesHastaAlcanceTemporal: number = 0,
		aplicaDerechosEspontaneos: boolean = false,
		aplicaCancelacionAnticipada: boolean = false,
		aplicaTotalidadDeudaAdministrativa: boolean = false,
		aplicaDeudaAdministrativa: boolean = false,
		aplicaDeudaLegal: boolean = false,
		aplicaGranContribuyente: boolean = false,
		aplicaPequenioContribuyente: boolean = false,
		caducidadAnticipoImpago: boolean = false,
		caducidadCantidadCuotasConsecutivas: number = 0,
		caducidadCantidadCuotasNoConsecutivas: number = 0,
		caducidadCantidadDiasVencimiento: number = 0,
		caducidadCantidadDeclaracionesJuradas: number = 0,
		montoDeudaAdministrativaDesde: number = 0,
		montoDeudaAdministrativaHasta: number = 0,
		montoCuotaDesde: number = 0,
		montoCuotaHasta: number = 0,
		idTipoCalculoInteres: number = 0,
		idUsuarioCreacion: number = 0,
		fechaCreacion: Date = null,
		tipoPlanPago: TipoPlanPago = null
	)
	{
        this.id = id;
		this.idEstadoPlanPagoDefinicion = idEstadoPlanPagoDefinicion;
		this.idTipoPlanPago = idTipoPlanPago;
		this.idTipoTributo = idTipoTributo;
		this.idTasaPlanPago = idTasaPlanPago;
		this.idSubTasaPlanPago = idSubTasaPlanPago;
		this.idTasaInteres = idTasaInteres;
		this.idSubTasaInteres = idSubTasaInteres;
		this.idTasaSellados = idTasaSellados;
		this.idSubTasaSellados = idSubTasaSellados;
		this.idTasaGastosCausidicos = idTasaGastosCausidicos;
		this.idSubTasaGastosCausidicos = idSubTasaGastosCausidicos;
		this.codigo = codigo;
		this.descripcion = descripcion;
		this.fechaDesde = fechaDesde;
		this.fechaHasta = fechaHasta;
		this.tieneAnticipo = tieneAnticipo;
		this.cuotaDesde = cuotaDesde;
		this.cuotaHasta = cuotaHasta;
		this.peridiocidad = peridiocidad;
		this.idTipoVencimientoAnticipo = idTipoVencimientoAnticipo;
		this.idTipoVencimientoCuota1 = idTipoVencimientoCuota1;
		this.idTipoVencimientoCuotas = idTipoVencimientoCuotas;
		this.porcentajeAnticipo = porcentajeAnticipo;
		this.idTipoAlcanceTemporal = idTipoAlcanceTemporal;
		this.fechaDesdeAlcanceTemporal = fechaDesdeAlcanceTemporal;
		this.fechaHastaAlcanceTemporal = fechaHastaAlcanceTemporal;
		this.mesDesdeAlcanceTemporal = mesDesdeAlcanceTemporal;
		this.mesHastaAlcanceTemporal = mesHastaAlcanceTemporal;
		this.aplicaDerechosEspontaneos = aplicaDerechosEspontaneos;
		this.aplicaCancelacionAnticipada = aplicaCancelacionAnticipada;
		this.aplicaTotalidadDeudaAdministrativa = aplicaTotalidadDeudaAdministrativa;
		this.aplicaDeudaAdministrativa = aplicaDeudaAdministrativa;
		this.aplicaDeudaLegal = aplicaDeudaLegal;
		this.aplicaGranContribuyente = aplicaGranContribuyente;
		this.aplicaPequenioContribuyente = aplicaPequenioContribuyente;
		this.caducidadAnticipoImpago = caducidadAnticipoImpago;
		this.caducidadCantidadCuotasConsecutivas = caducidadCantidadCuotasConsecutivas;
		this.caducidadCantidadCuotasNoConsecutivas = caducidadCantidadCuotasNoConsecutivas;
		this.caducidadCantidadDiasVencimiento = caducidadCantidadDiasVencimiento;
		this.caducidadCantidadDeclaracionesJuradas = caducidadCantidadDeclaracionesJuradas;
		this.montoDeudaAdministrativaDesde = montoDeudaAdministrativaDesde;
		this.montoDeudaAdministrativaHasta = montoDeudaAdministrativaHasta;
		this.montoCuotaDesde = montoCuotaDesde;
		this.montoCuotaHasta = montoCuotaHasta;
		this.idTipoCalculoInteres = idTipoCalculoInteres;
		this.idUsuarioCreacion = idUsuarioCreacion;
		this.fechaCreacion = fechaCreacion;
		this.tipoPlanPago = tipoPlanPago;
	}

	setFromObject = (row) =>
	{
		this.id = row.id ?? 0;
		this.idEstadoPlanPagoDefinicion = row.idEstadoPlanPagoDefinicion ?? 0;
		this.idTipoPlanPago = row.idTipoPlanPago ?? 0;
		this.idTipoTributo = row.idTipoTributo ?? 0;
		this.idTasaPlanPago = row.idTasaPlanPago ?? 0;
		this.idSubTasaPlanPago = row.idSubTasaPlanPago ?? 0;
		this.idTasaInteres = row.idTasaInteres ?? 0;
		this.idSubTasaInteres = row.idSubTasaInteres ?? 0;
		this.idTasaSellados = row.idTasaSellados ?? 0;
		this.idSubTasaSellados = row.idSubTasaSellados ?? 0;
		this.idTasaGastosCausidicos = row.idTasaGastosCausidicos ?? 0;
		this.idSubTasaGastosCausidicos = row.idSubTasaGastosCausidicos ?? 0;
		this.codigo = row.codigo ?? "";
		this.descripcion = row.descripcion ?? "";
		this.fechaDesde = row.fechaDesde ?? null;
		this.fechaHasta = row.fechaHasta ?? null;
		this.tieneAnticipo = row.tieneAnticipo ?? false;
		this.cuotaDesde = row.cuotaDesde ?? 0;
		this.cuotaHasta = row.cuotaHasta ?? 0;
		this.peridiocidad = row.peridiocidad ?? 0;
		this.idTipoVencimientoAnticipo = row.idTipoVencimientoAnticipo ?? 0;
		this.idTipoVencimientoCuota1 = row.idTipoVencimientoCuota1 ?? 0;
		this.idTipoVencimientoCuotas = row.idTipoVencimientoCuotas ?? 0;
		this.porcentajeAnticipo = row.porcentajeAnticipo ?? 0;
		this.idTipoAlcanceTemporal = row.idTipoAlcanceTemporal ?? 0;
		this.fechaDesdeAlcanceTemporal = row.fechaDesdeAlcanceTemporal ?? null;
		this.fechaHastaAlcanceTemporal = row.fechaHastaAlcanceTemporal ?? null;
		this.mesDesdeAlcanceTemporal = row.mesDesdeAlcanceTemporal ?? 0;
		this.mesHastaAlcanceTemporal = row.mesHastaAlcanceTemporal ?? 0;
		this.aplicaDerechosEspontaneos = row.aplicaDerechosEspontaneos ?? false;
		this.aplicaCancelacionAnticipada = row.aplicaCancelacionAnticipada ?? false;
		this.aplicaTotalidadDeudaAdministrativa = row.aplicaTotalidadDeudaAdministrativa ?? false;
		this.aplicaDeudaAdministrativa = row.aplicaDeudaAdministrativa ?? false;
		this.aplicaDeudaLegal = row.aplicaDeudaLegal ?? false;
		this.aplicaGranContribuyente = row.aplicaGranContribuyente ?? false;
		this.aplicaPequenioContribuyente = row.aplicaPequenioContribuyente ?? false;
		this.caducidadAnticipoImpago = row.caducidadAnticipoImpago ?? false;
		this.caducidadCantidadCuotasConsecutivas = row.caducidadCantidadCuotasConsecutivas ?? 0;
		this.caducidadCantidadCuotasNoConsecutivas = row.caducidadCantidadCuotasNoConsecutivas ?? 0;
		this.caducidadCantidadDiasVencimiento = row.caducidadCantidadDiasVencimiento ?? 0;
		this.caducidadCantidadDeclaracionesJuradas = row.caducidadCantidadDeclaracionesJuradas ?? 0;
		this.montoDeudaAdministrativaDesde = row.montoDeudaAdministrativaDesde ?? 0;
		this.montoDeudaAdministrativaHasta = row.montoDeudaAdministrativaHasta ?? 0;
		this.montoCuotaDesde = row.montoCuotaDesde ?? 0;
		this.montoCuotaHasta = row.montoCuotaHasta ?? 0;
		this.idTipoCalculoInteres = row.idTipoCalculoInteres ?? 0;
		this.idUsuarioCreacion = row.idUsuarioCreacion ?? 0;
		this.fechaCreacion = row.fechaCreacion ?? null;
		this.tipoPlanPago = row.tipoPlanPago ?? null;
	}

}
