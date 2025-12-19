import MovimientoCaja from "../entities/movimiento-caja";

export default interface IMovimientoCajaRepository {

	list();

	listByCajaAsignacion(idCajaAsignacion:number);

	findById(id:number);

	add(row:MovimientoCaja);

	modify(id:number, row:MovimientoCaja);

	remove(id:number);

}
