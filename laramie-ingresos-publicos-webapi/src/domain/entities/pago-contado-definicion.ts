import TipoPlanPago from "./tipo-plan-pago";

export default class PagoContadoDefinicion {

    id: number;
	idEstadoPagoContadoDefinicion: number;
	idTipoPlanPago: number;
	idTipoTributo: number;
	idTasaPagoContado: number;
	idSubTasaPagoContado: number;
	idTasaSellados: number;
	idSubTasaSellados: number;
	idTasaGastosCausidicos: number;
	idSubTasaGastosCausidicos: number;
	codigo: string;
	descripcion: string;
	fechaDesde: Date;
	fechaHasta: Date;
	idTipoAlcanceTemporal: number;
	fechaDesdeAlcanceTemporal: Date;
	fechaHastaAlcanceTemporal: Date;
	mesDesdeAlcanceTemporal: number;
	mesHastaAlcanceTemporal: number;
	aplicaDerechosEspontaneos: boolean;
	aplicaTotalidadDeudaAdministrativa: boolean;
	aplicaDeudaAdministrativa: boolean;
	aplicaDeudaLegal: boolean;
	aplicaGranContribuyente: boolean;
	aplicaPequenioContribuyente: boolean;
	montoDeudaAdministrativaDesde: number;
	montoDeudaAdministrativaHasta: number;
	idViaConsolidacion: number;
	porcentajeQuitaRecargos: number;
	porcentajeQuitaMultaInfracciones: number;
	porcentajeQuitaHonorarios: number;
	porcentajeQuitaAportes: number;
	idUsuarioCreacion: number;
	fechaCreacion: Date;

	tipoPlanPago: TipoPlanPago;

	constructor(
        id: number = 0,
		idEstadoPagoContadoDefinicion: number = 0,
		idTipoPlanPago: number = 0,
		idTipoTributo: number = 0,
		idTasaPagoContado: number = 0,
		idSubTasaPagoContado: number = 0,
		idTasaSellados: number = 0,
		idSubTasaSellados: number = 0,
		idTasaGastosCausidicos: number = 0,
		idSubTasaGastosCausidicos: number = 0,
		codigo: string = "",
		descripcion: string = "",
		fechaDesde: Date = null,
		fechaHasta: Date = null,
		idTipoAlcanceTemporal: number = 0,
		fechaDesdeAlcanceTemporal: Date = null,
		fechaHastaAlcanceTemporal: Date = null,
		mesDesdeAlcanceTemporal: number = 0,
		mesHastaAlcanceTemporal: number = 0,
		aplicaDerechosEspontaneos: boolean = false,
		aplicaTotalidadDeudaAdministrativa: boolean = false,
		aplicaDeudaAdministrativa: boolean = false,
		aplicaDeudaLegal: boolean = false,
		aplicaGranContribuyente: boolean = false,
		aplicaPequenioContribuyente: boolean = false,
		montoDeudaAdministrativaDesde: number = 0,
		montoDeudaAdministrativaHasta: number = 0,
		idViaConsolidacion: number = 0,
		porcentajeQuitaRecargos: number = 0,
		porcentajeQuitaMultaInfracciones: number = 0,
		porcentajeQuitaHonorarios: number = 0,
		porcentajeQuitaAportes: number = 0,
		idUsuarioCreacion: number = 0,
		fechaCreacion: Date = null,
		tipoPlanPago: TipoPlanPago = null
	)
	{
        this.id = id;
		this.idEstadoPagoContadoDefinicion = idEstadoPagoContadoDefinicion;
		this.idTipoPlanPago = idTipoPlanPago;
		this.idTipoTributo = idTipoTributo;
		this.idTasaPagoContado = idTasaPagoContado;
		this.idSubTasaPagoContado = idSubTasaPagoContado;
		this.idTasaSellados = idTasaSellados;
		this.idSubTasaSellados = idSubTasaSellados;
		this.idTasaGastosCausidicos = idTasaGastosCausidicos;
		this.idSubTasaGastosCausidicos = idSubTasaGastosCausidicos;
		this.codigo = codigo;
		this.descripcion = descripcion;
		this.fechaDesde = fechaDesde;
		this.fechaHasta = fechaHasta;
		this.idTipoAlcanceTemporal = idTipoAlcanceTemporal;
		this.fechaDesdeAlcanceTemporal = fechaDesdeAlcanceTemporal;
		this.fechaHastaAlcanceTemporal = fechaHastaAlcanceTemporal;
		this.mesDesdeAlcanceTemporal = mesDesdeAlcanceTemporal;
		this.mesHastaAlcanceTemporal = mesHastaAlcanceTemporal;
		this.aplicaDerechosEspontaneos = aplicaDerechosEspontaneos;
		this.aplicaTotalidadDeudaAdministrativa = aplicaTotalidadDeudaAdministrativa;
		this.aplicaDeudaAdministrativa = aplicaDeudaAdministrativa;
		this.aplicaDeudaLegal = aplicaDeudaLegal;
		this.aplicaGranContribuyente = aplicaGranContribuyente;
		this.aplicaPequenioContribuyente = aplicaPequenioContribuyente;
		this.montoDeudaAdministrativaDesde = montoDeudaAdministrativaDesde;
		this.montoDeudaAdministrativaHasta = montoDeudaAdministrativaHasta;
		this.idViaConsolidacion = idViaConsolidacion;
		this.porcentajeQuitaRecargos = porcentajeQuitaRecargos;
		this.porcentajeQuitaMultaInfracciones = porcentajeQuitaMultaInfracciones;
		this.porcentajeQuitaHonorarios = porcentajeQuitaHonorarios;
		this.porcentajeQuitaAportes = porcentajeQuitaAportes;
		this.idUsuarioCreacion = idUsuarioCreacion;
		this.fechaCreacion = fechaCreacion;
		this.tipoPlanPago = tipoPlanPago;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idEstadoPagoContadoDefinicion = row.idEstadoPagoContadoDefinicion ?? 0;
		this.idTipoPlanPago = row.idTipoPlanPago ?? 0;
		this.idTipoTributo = row.idTipoTributo ?? 0;
		this.idTasaPagoContado = row.idTasaPagoContado ?? 0;
		this.idSubTasaPagoContado = row.idSubTasaPagoContado ?? 0;
		this.idTasaSellados = row.idTasaSellados ?? 0;
		this.idSubTasaSellados = row.idSubTasaSellados ?? 0;
		this.idTasaGastosCausidicos = row.idTasaGastosCausidicos ?? 0;
		this.idSubTasaGastosCausidicos = row.idSubTasaGastosCausidicos ?? 0;
		this.codigo = row.codigo ?? "";
		this.descripcion = row.descripcion ?? "";
		this.fechaDesde = row.fechaDesde ?? null;
		this.fechaHasta = row.fechaHasta ?? null;
		this.idTipoAlcanceTemporal = row.idTipoAlcanceTemporal ?? 0;
		this.fechaDesdeAlcanceTemporal = row.fechaDesdeAlcanceTemporal ?? null;
		this.fechaHastaAlcanceTemporal = row.fechaHastaAlcanceTemporal ?? null;
		this.mesDesdeAlcanceTemporal = row.mesDesdeAlcanceTemporal ?? 0;
		this.mesHastaAlcanceTemporal = row.mesHastaAlcanceTemporal ?? 0;
		this.aplicaDerechosEspontaneos = row.aplicaDerechosEspontaneos ?? false;
		this.aplicaTotalidadDeudaAdministrativa = row.aplicaTotalidadDeudaAdministrativa ?? false;
		this.aplicaDeudaAdministrativa = row.aplicaDeudaAdministrativa ?? false;
		this.aplicaDeudaLegal = row.aplicaDeudaLegal ?? false;
		this.aplicaGranContribuyente = row.aplicaGranContribuyente ?? false;
		this.aplicaPequenioContribuyente = row.aplicaPequenioContribuyente ?? false;
		this.montoDeudaAdministrativaDesde = row.montoDeudaAdministrativaDesde ?? 0;
		this.montoDeudaAdministrativaHasta = row.montoDeudaAdministrativaHasta ?? 0;
		this.idViaConsolidacion = row.idViaConsolidacion ?? 0;
		this.porcentajeQuitaRecargos = row.porcentajeQuitaRecargos ?? 0;
		this.porcentajeQuitaMultaInfracciones = row.porcentajeQuitaMultaInfracciones ?? 0;
		this.porcentajeQuitaHonorarios = row.porcentajeQuitaHonorarios ?? 0;
		this.porcentajeQuitaAportes = row.porcentajeQuitaAportes ?? 0;
		this.idUsuarioCreacion = row.idUsuarioCreacion ?? 0;
		this.fechaCreacion = row.fechaCreacion ?? null;
		this.tipoPlanPago = row.tipoPlanPago ?? null;
	}

}
