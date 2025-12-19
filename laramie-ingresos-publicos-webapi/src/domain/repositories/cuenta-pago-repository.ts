import CuentaPago from "../entities/cuenta-pago";

export default interface ICuentaPagoRepository {

	list();

	listByEmisionEjecucion(idEmisionEjecucion:number);

	listByPlanPago(idPlanPago:number);

	findById(id:number);

	add(row:CuentaPago);

	addByBloque(rows: Array<CuentaPago>);

	modify(id:number, row:CuentaPago);

	remove(id:number);

	onTransaction(request);
}
