import EmisionProcedimientoParametro from "../entities/emision-procedimiento-parametro";

export default interface IEmisionProcedimientoParametroRepository {

	list();

	listByEmisionEjecucion(idEmisionEjecucion:number);

	findById(id:number);

	add(row:EmisionProcedimientoParametro);

	modify(id:number, row:EmisionProcedimientoParametro);

	remove(id:number);

	removeByEmisionEjecucion(idEmisionEjecucion:number);

}
