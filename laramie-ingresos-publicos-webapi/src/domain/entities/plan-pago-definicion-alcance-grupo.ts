export default class PlanPagoDefinicionAlcanceGrupo {

    id: number;
	idPlanPagoDefinicion: number;
	idGrupo: number;

	constructor(
        id: number = 0,
		idPlanPagoDefinicion: number = 0,
		idGrupo: number = 0
	)
	{
        this.id = id;
		this.idPlanPagoDefinicion = idPlanPagoDefinicion;
		this.idGrupo = idGrupo;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPlanPagoDefinicion = row.idPlanPagoDefinicion ?? 0;
		this.idGrupo = row.idGrupo ?? 0;
	}

}
