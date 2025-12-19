import Rubro from "../entities/rubro";

export default interface IRubroRepository {

	list();

	findById(id:number);

	add(row:Rubro);

	modify(id:number, row:Rubro);

	remove(id:number);

}
