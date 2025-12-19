import CategoriaTasa from "../entities/categoria-tasa";

export default interface ICategoriaTasaRepository {

	list();

	findById(id:number);

	add(row:CategoriaTasa);

	modify(id:number, row:CategoriaTasa);

	remove(id:number);

}
