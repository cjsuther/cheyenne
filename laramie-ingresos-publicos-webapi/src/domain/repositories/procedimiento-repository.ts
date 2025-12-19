import Procedimiento from "../entities/procedimiento";

export default interface IProcedimientoRepository {

	list();

	findById(id:number);

	add(row:Procedimiento);

	modify(id:number, row:Procedimiento);

	remove(id:number);

	onTransaction(request);

}
