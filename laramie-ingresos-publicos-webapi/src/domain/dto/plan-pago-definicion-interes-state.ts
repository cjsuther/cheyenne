import PlanPagoDefinicionInteres from "../entities/plan-pago-definicion-interes";

export default class PlanPagoDefinicionInteresState extends PlanPagoDefinicionInteres{

    state: string;

	constructor(
        id: number = 0,
		idPlanPagoDefinicion: number = 0,
		cuotaDesde: number = 0,
		cuotaHasta: number = 0,
		porcentajeInteres: number = 0,
        state: string = "o"
	)
	{
        super(id, idPlanPagoDefinicion, cuotaDesde, cuotaHasta, porcentajeInteres);
        this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPlanPagoDefinicion = row.idPlanPagoDefinicion ?? 0;
		this.cuotaDesde = row.cuotaDesde ?? 0;
		this.cuotaHasta = row.cuotaHasta ?? 0;
		this.porcentajeInteres = row.porcentajeInteres ?? 0;
        this.state = row.state ?? "o";
	}

}
