import TipoVencimientoPlanPago from "../entities/tipo-vencimiento-plan-pago";

export default interface ITipoVencimientoPlanPagoRepository {

	list();

	findById(id:number);

	add(row:TipoVencimientoPlanPago);

	modify(id:number, row:TipoVencimientoPlanPago);

	remove(id:number);

}
