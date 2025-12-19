import TipoSuperficie from "../entities/tipo-superficie";

export default interface ITipoSuperficieRepository {

	list();

	findById(id:number);

	add(row:TipoSuperficie);

	modify(id:number, row:TipoSuperficie);

	remove(id:number);

}
