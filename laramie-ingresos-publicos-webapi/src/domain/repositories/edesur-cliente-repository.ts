import EdesurCliente from "../entities/edesur-cliente";

export default interface IEdesurClienteRepository {

	listByEdesur(idEdesur:number);

	findById(id:number);

	add(row:EdesurCliente);

	modify(id:number, row:EdesurCliente);

	remove(id:number);
	
	removeByEdesur(idEdesur: number);
	
}
