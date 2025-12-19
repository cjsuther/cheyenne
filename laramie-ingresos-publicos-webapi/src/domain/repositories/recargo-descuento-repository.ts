import RecargoDescuento from "../entities/recargo-descuento";

export default interface IRecargoDescuentoRepository {

	listByCuenta(idCuenta: number);

	findById(id:number);

	add(row:RecargoDescuento);

	modify(id:number, row:RecargoDescuento);

	remove(id:number);

	removeByCuenta(idCuenta: number);

}
