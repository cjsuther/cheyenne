import TasaFilter from "../dto/tasa-filter";
import Tasa from "../entities/tasa";

export default interface ITasaRepository {

	list();

	listByFilter(tasaFilter: TasaFilter);

	findById(id:number);

	add(row:Tasa);

	modify(id:number, row:Tasa);

	remove(id:number);

	onTransaction(request);

}
