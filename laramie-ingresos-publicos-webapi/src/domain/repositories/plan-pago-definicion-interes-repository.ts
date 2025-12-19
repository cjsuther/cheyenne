import PlanPagoDefinicionInteres from "../entities/plan-pago-definicion-interes";

export default interface IPlanPagoDefinicionInteresRepository {

	list();

	listByPlanPagoDefinicion(idPlanPagoDefinicion: number);

	findById(id:number);

	add(row:PlanPagoDefinicionInteres);

	modify(id:number, row:PlanPagoDefinicionInteres);

	remove(id:number);

	removeByPlanPagoDefinicion(idPlanPagoDefinicion:number);

}
