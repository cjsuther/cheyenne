import PlanPagoDefinicionTipoVinculoCuenta from "../entities/plan-pago-definicion-tipo-vinculo-cuenta";

export default class PlanPagoDefinicionTipoVinculoCuentaState extends PlanPagoDefinicionTipoVinculoCuenta{

    state: string;

	constructor(
        id: number = 0,
		idPlanPagoDefinicion: number = 0,
		idTipoVinculoCuenta: number = 0,
        state: string = "o"
	)
	{
        super(id, idPlanPagoDefinicion, idTipoVinculoCuenta);
        this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idPlanPagoDefinicion = row.idPlanPagoDefinicion ?? 0;
		this.idTipoVinculoCuenta = row.idTipoVinculoCuenta ?? 0;
        this.state = row.state ?? "o";
	}

}
