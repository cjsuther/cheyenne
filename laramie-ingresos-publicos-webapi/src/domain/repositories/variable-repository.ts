import Variable from "../entities/variable";

export default interface IVariableRepository {

	list();

	listByTipoTributo(idTipoTributo:number);

	findById(id:number);

	findByCodigo(codigo:string);

	add(row:Variable);

	modify(id:number, row:Variable);

	remove(id:number);

}
