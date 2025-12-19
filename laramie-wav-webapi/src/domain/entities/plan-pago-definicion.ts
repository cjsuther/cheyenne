export default class PlanPagoDefinicion {

    id: number;
	idTipoPlanPago: number;
	codigo: string;
	descripcion: string;
	tieneQuita: boolean;
	tieneAnticipo: boolean;
	porcentajeAnticipo: number;
	cuotaDesde: number;
	cuotaHasta: number;
	aplicaTitular: boolean;
    aplicaResponsableCuenta: boolean;
	importeCapital: number;

	constructor(
        id: number = 0,
		idTipoPlanPago: number = 0,
		codigo: string = "",
		descripcion: string = "",
		tieneQuita: boolean = false,
		tieneAnticipo: boolean = false,
		porcentajeAnticipo: number = 0,
		cuotaDesde: number = 0,
		cuotaHasta: number = 0,
		aplicaTitular: boolean = false,
        aplicaResponsableCuenta: boolean = false,
		importeCapital: number = 0
	)
	{
        this.id = id;
		this.idTipoPlanPago = idTipoPlanPago;
		this.codigo = codigo;
		this.descripcion = descripcion;
		this.tieneQuita = tieneQuita;
		this.tieneAnticipo = tieneAnticipo;
		this.porcentajeAnticipo = porcentajeAnticipo;
		this.cuotaDesde = cuotaDesde;
		this.cuotaHasta = cuotaHasta;
		this.aplicaTitular = aplicaTitular;
		this.aplicaResponsableCuenta = aplicaResponsableCuenta;
		this.importeCapital = importeCapital;
	}

	setFromObject = (row) =>
	{
		this.id = row.id ?? 0;
		this.idTipoPlanPago = row.idTipoPlanPago ?? 0;
		this.codigo = row.codigo ?? "";
		this.descripcion = row.descripcion ?? "";
		this.tieneQuita = row.tieneQuita ?? false;
		this.tieneAnticipo = row.tieneAnticipo ?? false;
		this.porcentajeAnticipo = row.porcentajeAnticipo ?? 0;
		this.cuotaDesde = row.cuotaDesde ?? 0;
		this.cuotaHasta = row.cuotaHasta ?? 0;
		this.aplicaTitular = row.aplicaTitular ?? false;
		this.aplicaResponsableCuenta = row.aplicaResponsableCuenta ?? false;
		this.importeCapital = row.importeCapital ?? 0;
	}

}
