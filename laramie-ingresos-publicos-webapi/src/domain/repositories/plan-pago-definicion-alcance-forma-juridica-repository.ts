import PlanPagoDefinicionAlcanceFormaJuridica from "../entities/plan-pago-definicion-alcance-forma-juridica";

export default interface IPlanPagoDefinicionAlcanceFormaJuridicaRepository {

	list();

	listByPlanPagoDefinicion(idPlanPagoDefinicion:number);

	findById(id:number);

	add(row:PlanPagoDefinicionAlcanceFormaJuridica);

	modify(id:number, row:PlanPagoDefinicionAlcanceFormaJuridica);

	remove(id:number);

	removeByPlanPagoDefinicion(idPlanPagoDefinicion:number);

}
