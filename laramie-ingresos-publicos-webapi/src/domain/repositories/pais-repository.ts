import Pais from "../entities/pais";

export default interface IPaisRepository {

	list();

	findById(id:number);

	add(row:Pais);

	modify(id:number, row:Pais);

	remove(id:number);

}
