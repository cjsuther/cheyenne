import TipoMovimiento from "../entities/tipo-movimiento";

export default interface ITipoMovimientoRepository {

	list();

	findById(id:number);

	findByCodigo(codigo:string);

	add(row:TipoMovimiento);

	modify(id:number, row:TipoMovimiento);

	remove(id:number);

}
