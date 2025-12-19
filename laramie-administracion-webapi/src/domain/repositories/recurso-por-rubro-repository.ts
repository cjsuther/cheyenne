import RecursoPorRubro from "../entities/recurso-por-rubro";

export default interface IRecursoPorRubroRepository {

	list();

	findById(id:number);

	add(row:RecursoPorRubro);

	modify(id:number, row:RecursoPorRubro);

	remove(id:number);

}
