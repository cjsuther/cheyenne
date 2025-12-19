import PlanPagoDefinicionAlcanceCondicionFiscal from "../entities/plan-pago-definicion-alcance-condicion-fiscal";

export default class PlanPagoDefinicionAlcanceCondicionFiscalState extends PlanPagoDefinicionAlcanceCondicionFiscal {

    state: string;

	constructor(
        id: number = 0,
		idPlanPagoDefinicion: number = 0,
		idCondicionFiscal: number = 0,
        state: string = "o"
	)
	{
        super(id, idPlanPagoDefinicion, idCondicionFiscal);
        this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPlanPagoDefinicion = row.idPlanPagoDefinicion ?? 0;
		this.idCondicionFiscal = row.idCondicionFiscal ?? 0;
        this.state = row.state ?? "o";
	}

}
