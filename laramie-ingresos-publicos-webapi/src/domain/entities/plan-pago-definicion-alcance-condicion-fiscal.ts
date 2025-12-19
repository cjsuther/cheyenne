export default class PlanPagoDefinicionAlcanceCondicionFiscal {

    id: number;
	idPlanPagoDefinicion: number;
	idCondicionFiscal: number;

	constructor(
        id: number = 0,
		idPlanPagoDefinicion: number = 0,
		idCondicionFiscal: number = 0
	)
	{
        this.id = id;
		this.idPlanPagoDefinicion = idPlanPagoDefinicion;
		this.idCondicionFiscal = idCondicionFiscal;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPlanPagoDefinicion = row.idPlanPagoDefinicion ?? 0;
		this.idCondicionFiscal = row.idCondicionFiscal ?? 0;
	}

}
