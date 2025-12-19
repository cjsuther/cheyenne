import PlanPagoDefinicionAlcanceZonaTarifaria from "../entities/plan-pago-definicion-alcance-zona-tarifaria";

export default interface IPlanPagoDefinicionAlcanceZonaTarifariaRepository {

	list();

	listByPlanPagoDefinicion(idPlanPagoDefinicion: number);

	findById(id:number);

	add(row:PlanPagoDefinicionAlcanceZonaTarifaria);

	modify(id:number, row:PlanPagoDefinicionAlcanceZonaTarifaria);

	remove(id:number);

	removeByPlanPagoDefinicion(idPlanPagoDefinicion:number);

}
