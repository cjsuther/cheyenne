import PlanPagoDefinicionAlcanceGrupo from "../entities/plan-pago-definicion-alcance-grupo";

export default class PlanPagoDefinicionAlcanceGrupoState extends PlanPagoDefinicionAlcanceGrupo {

    state: string;

	constructor(
        id: number = 0,
		idPlanPagoDefinicion: number = 0,
		idGrupo: number = 0,
        state: string = "o"
	)
	{
        super(id, idPlanPagoDefinicion, idGrupo);
        this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPlanPagoDefinicion = row.idPlanPagoDefinicion ?? 0;
		this.idGrupo = row.idGrupo ?? 0;
        this.state = row.state ?? "o";
	}

}
