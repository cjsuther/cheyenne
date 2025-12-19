import PlanPagoDefinicionTipoVinculoCuenta from "../entities/plan-pago-definicion-tipo-vinculo-cuenta";

export default interface IPlanPagoDefinicionTipoVinculoCuentaRepository {

	list();

	listByPlanPagoDefinicion(idPlanPagoDefinicion: number);

	findById(id:number);

	add(row:PlanPagoDefinicionTipoVinculoCuenta);

	modify(id:number, row:PlanPagoDefinicionTipoVinculoCuenta);

	remove(id:number);

	removeByPlanPagoDefinicion(idPlanPagoDefinicion:number);

}
