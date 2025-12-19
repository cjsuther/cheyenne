import RubroProvincia from "../entities/rubro-provincia";

export default interface IRubroProvinciaRepository {

	list();

	findById(id:number);

	add(row:RubroProvincia);

	modify(id:number, row:RubroProvincia);

	remove(id:number);

}
