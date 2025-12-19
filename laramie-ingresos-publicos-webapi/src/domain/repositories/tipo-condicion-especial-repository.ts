import TipoCondicionEspecial from "../entities/tipo-condicion-especial";

export default interface ITipoCondicionEspecialRepository {

	list();

	findById(id:number);

	findByCodigo(codigo:string);

	add(row:TipoCondicionEspecial);

	modify(id:number, row:TipoCondicionEspecial);

	remove(id:number);

}
