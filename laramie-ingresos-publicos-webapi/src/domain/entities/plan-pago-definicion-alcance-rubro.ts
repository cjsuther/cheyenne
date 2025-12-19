export default class PlanPagoDefinicionAlcanceRubro {

    id: number;
	idPlanPagoDefinicion: number;
	idRubro: number;

	constructor(
        id: number = 0,
		idPlanPagoDefinicion: number = 0,
		idRubro: number = 0
	)
	{
        this.id = id;
		this.idPlanPagoDefinicion = idPlanPagoDefinicion;
		this.idRubro = idRubro;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPlanPagoDefinicion = row.idPlanPagoDefinicion ?? 0;
		this.idRubro = row.idRubro ?? 0;
	}

}
