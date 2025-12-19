import MovimientoMedioPago from "../entities/movimiento-medio-pago";

export default interface IMovimientoMedioPagoRepository {

	list();
	
	listByMovimientoCaja(idMovimientoCaja:number);

	findById(id:number);

	add(row:MovimientoMedioPago);

	modify(id:number, row:MovimientoMedioPago);

	remove(id:number);

	removeByMovimientoCaja(idMovimientoCaja:number);
	
}
