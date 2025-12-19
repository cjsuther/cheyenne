export default class PlanPagoDefinicionInteres {

    id: number;
	idPlanPagoDefinicion: number;
	cuotaDesde: number;
	cuotaHasta: number;
	porcentajeInteres: number;

	constructor(
        id: number = 0,
		idPlanPagoDefinicion: number = 0,
		cuotaDesde: number = 0,
		cuotaHasta: number = 0,
		porcentajeInteres: number = 0
	)
	{
        this.id = id;
		this.idPlanPagoDefinicion = idPlanPagoDefinicion;
		this.cuotaDesde = cuotaDesde;
		this.cuotaHasta = cuotaHasta;
		this.porcentajeInteres = porcentajeInteres;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPlanPagoDefinicion = row.idPlanPagoDefinicion ?? 0;
		this.cuotaDesde = row.cuotaDesde ?? 0;
		this.cuotaHasta = row.cuotaHasta ?? 0;
		this.porcentajeInteres = row.porcentajeInteres ?? 0;
	}

}
