export default class PlanPagoDefinicionAlcanceRubroAfip {

    id: number;
	idPlanPagoDefinicion: number;
	idRubroAfip: number;

	constructor(
        id: number = 0,
		idPlanPagoDefinicion: number = 0,
		idRubroAfip: number = 0
	)
	{
        this.id = id;
		this.idPlanPagoDefinicion = idPlanPagoDefinicion;
		this.idRubroAfip = idRubroAfip;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPlanPagoDefinicion = row.idPlanPagoDefinicion ?? 0;
		this.idRubroAfip = row.idRubroAfip ?? 0;
	}

}
