import PlanPagoDefinicionQuitaCuota from "../entities/plan-pago-definicion-quita-cuota";

export default interface IPlanPagoDefinicionQuitaCuotaRepository {

	list();

	listByPlanPagoDefinicion(idPlanPagoDefinicion: number);

	findById(id:number);

	add(row:PlanPagoDefinicionQuitaCuota);

	modify(id:number, row:PlanPagoDefinicionQuitaCuota);

	remove(id:number);

	removeByPlanPagoDefinicion(idPlanPagoDefinicion:number);

}
