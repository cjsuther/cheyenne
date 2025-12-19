import PlanPagoDefinicionAlcanceRubro from "../entities/plan-pago-definicion-alcance-rubro";

export default interface IPlanPagoDefinicionAlcanceRubroRepository {

	list();

	listByPlanPagoDefinicion(idPlanPagoDefinicion: number);

	findById(id:number);

	add(row:PlanPagoDefinicionAlcanceRubro);

	modify(id:number, row:PlanPagoDefinicionAlcanceRubro);

	remove(id:number);

	removeByPlanPagoDefinicion(idPlanPagoDefinicion:number);

}
