import PlanPagoDefinicionAlcanceTasa from "../entities/plan-pago-definicion-alcance-tasa";

export default class PlanPagoDefinicionAlcanceTasaState extends PlanPagoDefinicionAlcanceTasa  {

    state: string;

	constructor(
        id: number = 0,
		idPlanPagoDefinicion: number = 0,
		idTasa: number = 0,
		idSubTasa: number = 0,
        state: string = "o"
	)
    {
        super(id, idPlanPagoDefinicion, idTasa, idSubTasa);
        this.state = state;
    }

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPlanPagoDefinicion = row.idPlanPagoDefinicion ?? 0;
		this.idTasa = row.idTasa ?? 0;
		this.idSubTasa = row.idSubTasa ?? 0;
        this.state = row.state ?? "o";
	}

}
