import TipoDDJJ from "../entities/tipo-ddjj";

export default interface ITipoDDJJRepository {

	list();

	findById(id:number);

	add(row:TipoDDJJ);

	modify(id:number, row:TipoDDJJ);

	remove(id:number);

}
