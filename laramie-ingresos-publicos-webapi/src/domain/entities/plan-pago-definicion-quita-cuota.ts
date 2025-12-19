export default class PlanPagoDefinicionQuitaCuota {

    id: number;
	idPlanPagoDefinicion: number;
	cuotaDesde: number;
	cuotaHasta: number;
	porcentajeQuitaRecargos: number;
	porcentajeQuitaMultaInfracciones: number;
	porcentajeQuitaHonorarios: number;
	porcentajeQuitaAportes: number;

	constructor(
        id: number = 0,
		idPlanPagoDefinicion: number = 0,
		cuotaDesde: number = 0,
		cuotaHasta: number = 0,
		porcentajeQuitaRecargos: number = 0,
		porcentajeQuitaMultaInfracciones: number = 0,
		porcentajeQuitaHonorarios: number = 0,
		porcentajeQuitaAportes: number = 0
	)
	{
        this.id = id;
		this.idPlanPagoDefinicion = idPlanPagoDefinicion;
		this.cuotaDesde = cuotaDesde;
		this.cuotaHasta = cuotaHasta;
		this.porcentajeQuitaRecargos = porcentajeQuitaRecargos;
		this.porcentajeQuitaMultaInfracciones = porcentajeQuitaMultaInfracciones;
		this.porcentajeQuitaHonorarios = porcentajeQuitaHonorarios;
		this.porcentajeQuitaAportes = porcentajeQuitaAportes;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPlanPagoDefinicion = row.idPlanPagoDefinicion ?? 0;
		this.cuotaDesde = row.cuotaDesde ?? 0;
		this.cuotaHasta = row.cuotaHasta ?? 0;
		this.porcentajeQuitaRecargos = row.porcentajeQuitaRecargos ?? 0;
		this.porcentajeQuitaMultaInfracciones = row.porcentajeQuitaMultaInfracciones ?? 0;
		this.porcentajeQuitaHonorarios = row.porcentajeQuitaHonorarios ?? 0;
		this.porcentajeQuitaAportes = row.porcentajeQuitaAportes ?? 0;
	}

}
