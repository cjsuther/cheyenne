import Obra from "../entities/obra";

export default interface IObraRepository {

	list();

	findById(id:number);

	add(row:Obra);

	modify(id:number, row:Obra);

	remove(id:number);

}
