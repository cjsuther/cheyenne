export default class PlanPagoDefinicionAlcanceZonaTarifaria {

    id: number;
	idPlanPagoDefinicion: number;
	idZonaTarifaria: number;

	constructor(
        id: number = 0,
		idPlanPagoDefinicion: number = 0,
		idZonaTarifaria: number = 0
	)
	{
        this.id = id;
		this.idPlanPagoDefinicion = idPlanPagoDefinicion;
		this.idZonaTarifaria = idZonaTarifaria;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPlanPagoDefinicion = row.idPlanPagoDefinicion ?? 0;
		this.idZonaTarifaria = row.idZonaTarifaria ?? 0;
	}

}
