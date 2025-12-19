import PlanPagoDefinicionQuitaCuota from "../entities/plan-pago-definicion-quita-cuota";

export default class PlanPagoDefinicionQuitaCuotaState extends PlanPagoDefinicionQuitaCuota{

    state: string;

	constructor(
        id: number = 0,
		idPlanPagoDefinicion: number = 0,
		cuotaDesde: number = 0,
		cuotaHasta: number = 0,
		porcentajeQuitaRecargos: number = 0,
		porcentajeQuitaMultaInfracciones: number = 0,
		porcentajeQuitaHonorarios: number = 0,
		porcentajeQuitaAportes: number = 0,
        state: string = "o"
	)
	{
        super(id, idPlanPagoDefinicion, cuotaDesde, cuotaHasta, porcentajeQuitaRecargos, porcentajeQuitaMultaInfracciones,
            porcentajeQuitaHonorarios, porcentajeQuitaAportes);
        this.state = state;
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
        this.state = row.state ?? "o";
	}

}
