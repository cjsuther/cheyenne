import EmisionDefinicionFilter from "../dto/emision-definicion-filter";
import EmisionDefinicion from "../entities/emision-definicion";

export default interface IEmisionDefinicionRepository {

	list();

	listByFilter(emisionDefinicionFilter: EmisionDefinicionFilter);

	findById(id:number);

	findByNumero(numero:string);

	add(row:EmisionDefinicion);

	modify(id:number, row:EmisionDefinicion);

	remove(id:number);

	onTransaction(request);

}
