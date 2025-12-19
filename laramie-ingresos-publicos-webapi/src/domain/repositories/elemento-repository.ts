import Elemento from "../entities/elemento";

export default interface IElementoRepository {

	list();

	listByCuenta(idCuenta: number);

	findById(id:number);

	add(row:Elemento);

	modify(id:number, row:Elemento);

	remove(id:number);

}
