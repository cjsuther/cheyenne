import TipoPlanPago from "../entities/tipo-plan-pago";

export default interface ITipoPlanPagoRepository {

	list();

	findById(id:number);

	add(row:TipoPlanPago);

	modify(id:number, row:TipoPlanPago);

	remove(id:number);

}
