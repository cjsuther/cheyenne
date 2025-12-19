import TipoElemento from "../entities/tipo-elemento";

export default interface ITipoElementoRepository {

	list();
	
	listByClaseElemento(idClaseElemento: number);

	findById(id:number);

	add(row:TipoElemento);

	modify(id:number, row:TipoElemento);

	remove(id:number);

}
