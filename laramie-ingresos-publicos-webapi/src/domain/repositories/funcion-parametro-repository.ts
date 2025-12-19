import FuncionParametro from "../entities/funcion-parametro";

export default interface IFuncionParametroRepository {

	list();

	listByFuncion(idFuncion:number);

	findById(id:number);

	add(row:FuncionParametro);

	modify(id:number, row:FuncionParametro);

	remove(id:number);

}
