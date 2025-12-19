import EmisionAprobacion from "../entities/emision-aprobacion";

export default interface IEmisionAprobacionRepository {

	list();

	findByEmisionEjecucion(idEmisionEjecucion:number);
	
	findById(id:number);

	add(row:EmisionAprobacion);

	modify(id:number, row:EmisionAprobacion);

	remove(id:number);

	removeByEmisionEjecucion(idEmisionEjecucion:number);

	onTransaction(request);

}
