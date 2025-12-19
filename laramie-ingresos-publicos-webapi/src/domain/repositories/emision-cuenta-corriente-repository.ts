import EmisionCuentaCorriente from "../entities/emision-cuenta-corriente";

export default interface IEmisionCuentaCorrienteRepository {

	list();

	listByEmisionDefinicion(idEmisionDefinicion:number);

	findById(id:number);

	add(row:EmisionCuentaCorriente);

	modify(id:number, row:EmisionCuentaCorriente);

	remove(id:number);

	removeByEmisionDefinicion(idEmisionDefinicion:number);

}
