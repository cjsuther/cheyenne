import PlanPagoDefinicionAlcanceFormaJuridica from "../entities/plan-pago-definicion-alcance-forma-juridica";

export default class PlanPagoDefinicionAlcanceFormaJuridicaState extends PlanPagoDefinicionAlcanceFormaJuridica {

    state: string;

	constructor(
        id: number = 0,
		idPlanPagoDefinicion: number = 0,
		idFormaJuridica: number = 0,
        state: string = "o"
	)
	{
        super(id, idPlanPagoDefinicion, idFormaJuridica);
        this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPlanPagoDefinicion = row.idPlanPagoDefinicion ?? 0;
		this.idFormaJuridica = row.idFormaJuridica ?? 0;
        this.state = row.state ?? "o";
	}

}
