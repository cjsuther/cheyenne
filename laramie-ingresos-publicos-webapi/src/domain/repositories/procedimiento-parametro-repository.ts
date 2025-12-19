import ProcedimientoParametro from "../entities/procedimiento-parametro";

export default interface IProcedimientoParametroRepository {

	list();

	listByProcedimiento(idProcedimiento:number);

	findById(id:number);

	add(row:ProcedimientoParametro);

	modify(id:number, row:ProcedimientoParametro);

	remove(id:number);

	removeByProcedimiento(idProcedimiento:number);

}
