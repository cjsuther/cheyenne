import GrupoSuperficie from "../entities/grupo-superficie";

export default interface IGrupoSuperficieRepository {

	list();

	findById(id:number);

	add(row:GrupoSuperficie);

	modify(id:number, row:GrupoSuperficie);

	remove(id:number);

}
