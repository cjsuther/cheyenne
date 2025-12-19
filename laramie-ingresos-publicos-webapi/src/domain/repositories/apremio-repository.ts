import ApremioFilter from "../dto/apremio-filter";
import Apremio from "../entities/apremio";

export default interface IApremioRepository {

	list();

	listByFilter(apremioFilter: ApremioFilter);

	findById(id:number);

	add(row:Apremio);

	modify(id:number, row:Apremio);

	remove(id:number);

	onTransaction(request);

}
