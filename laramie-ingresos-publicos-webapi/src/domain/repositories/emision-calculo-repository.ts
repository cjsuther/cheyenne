import EmisionCalculo from "../entities/emision-calculo";

export default interface IEmisionCalculoRepository {

	list();

	listByEmisionDefinicion(idEmisionDefinicion:number);

	findById(id:number);

	add(row:EmisionCalculo);

	modify(id:number, row:EmisionCalculo);

	remove(id:number);

	removeByEmisionDefinicion(idEmisionDefinicion:number);

}
