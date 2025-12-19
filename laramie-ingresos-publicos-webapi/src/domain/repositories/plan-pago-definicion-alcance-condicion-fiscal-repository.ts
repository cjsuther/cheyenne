import PlanPagoDefinicionAlcanceCondicionFiscal from "../entities/plan-pago-definicion-alcance-condicion-fiscal";

export default interface IPlanPagoDefinicionAlcanceCondicionFiscalRepository {

	list();

	listByPlanPagoDefinicion(idPlanPagoDefinicion: number);

	findById(id:number);

	add(row:PlanPagoDefinicionAlcanceCondicionFiscal);

	modify(id:number, row:PlanPagoDefinicionAlcanceCondicionFiscal);

	remove(id:number);

	removeByPlanPagoDefinicion(idPlanPagoDefinicion:number);

}
