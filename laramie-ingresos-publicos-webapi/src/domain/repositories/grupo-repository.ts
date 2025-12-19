import Grupo from "../entities/grupo";

export default interface IGrupoRepository {

	list();

	findById(id:number);

	add(row:Grupo);

	modify(id:number, row:Grupo);

	remove(id:number);

}
