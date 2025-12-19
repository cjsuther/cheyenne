import VariableGlobal from "../entities/variable-global";

export default interface IVariableGlobalRepository {

	list();

	findById(id:number);

	add(row:VariableGlobal);

	modify(id:number, row:VariableGlobal);

	remove(id:number);

}
