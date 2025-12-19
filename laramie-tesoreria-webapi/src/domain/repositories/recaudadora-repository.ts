import Recaudadora from "../entities/recaudadora";

export default interface IRecaudadoraRepository {

	list();

	findById(id:number);

	findByCodigo(codigo:string);

	add(row:Recaudadora);

	modify(id:number, row:Recaudadora);

	remove(id:number);

}
