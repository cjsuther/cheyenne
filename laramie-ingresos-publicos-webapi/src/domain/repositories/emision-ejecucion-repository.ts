import EmisionEjecucionFilter from "../dto/emision-ejecucion-filter";
import EmisionEjecucion from "../entities/emision-ejecucion";

export default interface IEmisionEjecucionRepository {

	list();

	listByFilter(emisionEjecucionFilter: EmisionEjecucionFilter);

	listByEmisionDefinicion(idEmisionDefinicion: number);

	findById(id:number);

	findByNumero(numero:string, calculoMasivo:boolean);

	add(row:EmisionEjecucion);

	modify(id:number, row:EmisionEjecucion);

	remove(id:number);

	onTransaction(request);

}
