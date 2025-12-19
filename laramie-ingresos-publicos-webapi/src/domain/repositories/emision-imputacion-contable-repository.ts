import EmisionImputacionContable from "../entities/emision-imputacion-contable";

export default interface IEmisionImputacionContableRepository {

	list();

	listByEmisionDefinicion(idEmisionDefinicion:number);

	findById(id:number);

	add(row:EmisionImputacionContable);

	modify(id:number, row:EmisionImputacionContable);

	remove(id:number);

	removeByEmisionDefinicion(idEmisionDefinicion:number);

}
