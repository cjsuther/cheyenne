import PlanPagoDefinicionAlcanceGrupo from "../entities/plan-pago-definicion-alcance-grupo";

export default interface IPlanPagoDefinicionAlcanceGrupoRepository {

	list();

	listByPlanPagoDefinicion(idPlanPagoDefinicion: number);

	findById(id:number);

	add(row:PlanPagoDefinicionAlcanceGrupo);

	modify(id:number, row:PlanPagoDefinicionAlcanceGrupo);

	remove(id:number);

	removeByPlanPagoDefinicion(idPlanPagoDefinicion:number);

}
