import PlanPagoDefinicionAlcanceRubro from "../entities/plan-pago-definicion-alcance-rubro";

export default class PlanPagoDefinicionAlcanceRubroState extends PlanPagoDefinicionAlcanceRubro {

    state: string;

	constructor(
        id: number = 0,
		idPlanPagoDefinicion: number = 0,
		idRubro: number = 0,
        state: string = "o"
	)
	{
        super(id, idPlanPagoDefinicion, idRubro);
        this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPlanPagoDefinicion = row.idPlanPagoDefinicion ?? 0;
		this.idRubro = row.idRubro ?? 0;
        this.state = row.state ?? "o";
	}

}
