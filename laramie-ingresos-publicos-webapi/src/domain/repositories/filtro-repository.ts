import Filtro from "../entities/filtro";

export default interface IFiltroRepository {

	list();

	findById(id:number);

	add(row:Filtro);

	modify(id:number, row:Filtro);

	remove(id:number);

	execute(row:Filtro);

}
