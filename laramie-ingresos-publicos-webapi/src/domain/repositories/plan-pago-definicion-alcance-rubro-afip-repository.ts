import PlanPagoDefinicionAlcanceRubroAfip from "../entities/plan-pago-definicion-alcance-rubro-afip";

export default interface IPlanPagoDefinicionAlcanceRubroAfipRepository {

	list();

	listByPlanPagoDefinicion(idPlanPagoDefinicion:number);

	findById(id:number);

	add(row:PlanPagoDefinicionAlcanceRubroAfip);

	modify(id:number, row:PlanPagoDefinicionAlcanceRubroAfip);

	remove(id:number);

	removeByPlanPagoDefinicion(idPlanPagoDefinicion:number);

}
