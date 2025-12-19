import ProcedimientoFiltro from "../entities/procedimiento-filtro";

export default interface IProcedimientoFiltroRepository {

	list();

	listByProcedimiento(idProcedimiento: number);

	findById(id:number);

	add(row:ProcedimientoFiltro);

	modify(id:number, row:ProcedimientoFiltro);

	remove(id:number);

	removeByProcedimiento(idProcedimiento: number);

}
