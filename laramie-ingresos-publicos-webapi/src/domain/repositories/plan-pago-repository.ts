import PlanPago from "../entities/plan-pago";

export default interface IPlanPagoRepository {

	list();

	listByCuenta(idCuenta: number);

	findById(id:number);

	add(row:PlanPago);

	modify(id:number, row:PlanPago);

	remove(id:number);

	onTransaction(request);

}
