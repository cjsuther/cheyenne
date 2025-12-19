import PlanPagoDefinicionAlcanceRubroAfip from "../entities/plan-pago-definicion-alcance-rubro-afip";

export default class PlanPagoDefinicionAlcanceRubroAfipState extends PlanPagoDefinicionAlcanceRubroAfip {

    state: string;

	constructor(
        id: number = 0,
		idPlanPagoDefinicion: number = 0,
		idRubroAfip: number = 0,
        state: string = "o"
	)
	{
        super(id, idPlanPagoDefinicion, idRubroAfip);
        this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPlanPagoDefinicion = row.idPlanPagoDefinicion ?? 0;
		this.idRubroAfip = row.idRubroAfip ?? 0;
        this.state = row.state ?? "o";
	}

}
