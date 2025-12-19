export default class PlanPagoDefinicionAlcanceTasa {

    id: number;
	idPlanPagoDefinicion: number;
	idTasa: number;
	idSubTasa: number;

	constructor(
        id: number = 0,
		idPlanPagoDefinicion: number = 0,
		idTasa: number = 0,
		idSubTasa: number = 0
	)
	{
        this.id = id;
		this.idPlanPagoDefinicion = idPlanPagoDefinicion;
		this.idTasa = idTasa;
		this.idSubTasa = idSubTasa;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPlanPagoDefinicion = row.idPlanPagoDefinicion ?? 0;
		this.idTasa = row.idTasa ?? 0;
		this.idSubTasa = row.idSubTasa ?? 0;
	}

}
