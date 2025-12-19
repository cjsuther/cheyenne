import Escribano from "../entities/escribano";

export default interface IEscribanoRepository {

	list();

	findById(id:number);

	add(row:Escribano);

	modify(id:number, row:Escribano);

	remove(id:number);

}
