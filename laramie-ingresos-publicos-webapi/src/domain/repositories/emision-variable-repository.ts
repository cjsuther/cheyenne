import EmisionVariable from "../entities/emision-variable";

export default interface IEmisionVariableRepository {

	list();

	listByEmisionDefinicion(idEmisionDefinicion:number);

	findById(id:number);

	add(row:EmisionVariable);

	modify(id:number, row:EmisionVariable);

	remove(id:number);

	removeByEmisionDefinicion(idEmisionDefinicion:number);

}
