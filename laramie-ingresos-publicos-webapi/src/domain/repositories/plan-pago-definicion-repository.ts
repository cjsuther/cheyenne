import PlanPagoDefinicionFilter from "../dto/plan-pago-definicion-filter";
import PlanPagoDefinicion from "../entities/plan-pago-definicion";

export default interface IPlanPagoDefinicionRepository {

	list();

	listByFilter(planPagoDefinicionFilter: PlanPagoDefinicionFilter);

	findById(id:number);

	add(row:PlanPagoDefinicion);

	modify(id:number, row:PlanPagoDefinicion);

	remove(id:number);

	onTransaction(request);

}
