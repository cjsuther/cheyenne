import TipoRecargoDescuento from "../entities/tipo-recargo-descuento";

export default interface ITipoRecargoDescuentoRepository {

	list();

	findById(id:number);

	add(row:TipoRecargoDescuento);

	modify(id:number, row:TipoRecargoDescuento);

	remove(id:number);

}
