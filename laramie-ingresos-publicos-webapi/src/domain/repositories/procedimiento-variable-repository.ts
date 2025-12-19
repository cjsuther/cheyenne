import ProcedimientoVariable from "../entities/procedimiento-variable";

export default interface IProcedimientoVariableRepository {

	list();

	listByProcedimiento(idProcedimiento:number);

	findById(id:number);

	add(row:ProcedimientoVariable);

	modify(id:number, row:ProcedimientoVariable);

	remove(id:number);

	removeByProcedimiento(idProcedimiento:number);

}
