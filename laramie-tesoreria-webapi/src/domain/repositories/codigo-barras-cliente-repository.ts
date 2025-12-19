import CodigoBarrasCliente from "../entities/codigo-barras-cliente";

export default interface ICodigoBarrasClienteRepository {

	list();

	listByCodigoBarras(codigoBarras:string);

	findById(id:number);

	findByCodigoBarrasCliente(codigoBarrasCliente:string);

	add(row:CodigoBarrasCliente);

	modify(id:number, row:CodigoBarrasCliente);

	remove(id:number);

}
