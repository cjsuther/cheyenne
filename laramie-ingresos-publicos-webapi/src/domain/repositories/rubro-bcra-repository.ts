import RubroBCRA from "../entities/rubro-bcra";

export default interface IRubroBCRARepository {

	list();

	findById(id:number);

	add(row:RubroBCRA);

	modify(id:number, row:RubroBCRA);

	remove(id:number);

}
