import SubTasaFilter from "../dto/sub-tasa-filter";
import SubTasa from "../entities/sub-tasa";

export default interface ISubTasaRepository {

	list();

	listByFilter(subTasaFilter: SubTasaFilter);

	findById(id:number);

	add(row:SubTasa);

	modify(id:number, row:SubTasa);

	remove(id:number);

	onTransaction(request);

}
