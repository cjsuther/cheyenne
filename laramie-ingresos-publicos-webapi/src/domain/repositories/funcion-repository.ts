import Funcion from "../entities/funcion";

export default interface IFuncionRepository {

	list();

	findById(id:number);

	add(row:Funcion);

	modify(id:number, row:Funcion);

	remove(id:number);

}
