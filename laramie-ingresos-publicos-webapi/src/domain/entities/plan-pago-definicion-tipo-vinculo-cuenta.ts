export default class PlanPagoDefinicionTipoVinculoCuenta {

    id: number;
	idPlanPagoDefinicion: number;
	idTipoVinculoCuenta: number;

	constructor(
        id: number = 0,
		idPlanPagoDefinicion: number = 0,
		idTipoVinculoCuenta: number = 0
	)
	{
        this.id = id;
		this.idPlanPagoDefinicion = idPlanPagoDefinicion;
		this.idTipoVinculoCuenta = idTipoVinculoCuenta;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPlanPagoDefinicion = row.idPlanPagoDefinicion ?? 0;
		this.idTipoVinculoCuenta = row.idTipoVinculoCuenta ?? 0;
	}

}
