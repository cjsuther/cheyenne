import MovimientoReciboPublicacion from "../entities/movimiento-recibo-publicacion";

export default interface IMovimientoReciboPublicacionRepository {

	list();

	listByMovimientoCaja(idMovimientoCaja:number);

	findById(id:number);

	findByReciboPublicacion(idReciboPublicacion: number);

	add(row:MovimientoReciboPublicacion);

	modify(id:number, row:MovimientoReciboPublicacion);

	remove(id:number);

	removeByMovimientoCaja(idMovimientoCaja:number);

}
