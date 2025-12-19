import Cocheria from "../entities/cocheria";

export default interface ICocheriaRepository {

	list();

	findById(id:number);

	add(row:Cocheria);

	modify(id:number, row:Cocheria);

	remove(id:number);

}
