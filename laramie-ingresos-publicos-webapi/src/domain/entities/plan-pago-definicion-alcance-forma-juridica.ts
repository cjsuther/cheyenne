export default class PlanPagoDefinicionAlcanceFormaJuridica {

    id: number;
	idPlanPagoDefinicion: number;
	idFormaJuridica: number;

	constructor(
        id: number = 0,
		idPlanPagoDefinicion: number = 0,
		idFormaJuridica: number = 0
	)
	{
        this.id = id;
		this.idPlanPagoDefinicion = idPlanPagoDefinicion;
		this.idFormaJuridica = idFormaJuridica;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPlanPagoDefinicion = row.idPlanPagoDefinicion ?? 0;
		this.idFormaJuridica = row.idFormaJuridica ?? 0;
	}

}
