import Provincia from "../entities/provincia";

export default interface IProvinciaRepository {

	list();

	findById(id:number);

	add(row:Provincia);

	modify(id:number, row:Provincia);

	remove(id:number);

}
