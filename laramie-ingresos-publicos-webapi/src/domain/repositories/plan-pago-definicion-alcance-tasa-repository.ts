import PlanPagoDefinicionAlcanceTasa from "../entities/plan-pago-definicion-alcance-tasa";

export default interface IPlanPagoDefinicionAlcanceTasaRepository {

	list();

	listByPlanPagoDefinicion(idPlanPagoDefinicion: number);

	findById(id:number);

	add(row:PlanPagoDefinicionAlcanceTasa);

	modify(id:number, row:PlanPagoDefinicionAlcanceTasa);

	remove(id:number);

	removeByPlanPagoDefinicion(idPlanPagoDefinicion:number);

}
