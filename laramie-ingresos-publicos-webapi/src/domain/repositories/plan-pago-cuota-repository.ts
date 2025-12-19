import PlanPagoCuota from "../entities/plan-pago-cuota";

export default interface IPlanPagoCuotaRepository {

	list();

	listByPlanPago(idPlanPago:number);

	listByPendiente();

	findById(id:number);

	add(row:PlanPagoCuota);

	modify(id:number, row:PlanPagoCuota);

	remove(id:number);

}
