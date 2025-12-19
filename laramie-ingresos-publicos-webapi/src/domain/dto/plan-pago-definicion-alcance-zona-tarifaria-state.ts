import PlanPagoDefinicionAlcanceZonaTarifaria from "../entities/plan-pago-definicion-alcance-zona-tarifaria";

export default class PlanPagoDefinicionAlcanceZonaTarifariaState extends PlanPagoDefinicionAlcanceZonaTarifaria{

    state: string;

	constructor(
        id: number = 0,
		idPlanPagoDefinicion: number = 0,
		idZonaTarifaria: number = 0,
        state: string = "o"
	)
	{
        super(id, idPlanPagoDefinicion, idZonaTarifaria);
        this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPlanPagoDefinicion = row.idPlanPagoDefinicion ?? 0;
		this.idZonaTarifaria = row.idZonaTarifaria ?? 0;
        this.state = row.state ?? "o";
	}

}
