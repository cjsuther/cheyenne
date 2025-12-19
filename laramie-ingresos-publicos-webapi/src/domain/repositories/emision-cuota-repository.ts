import EmisionCuota from "../entities/emision-cuota";

export default interface IEmisionCuotaRepository {

	list();

	listByEmisionEjecucion(idEmisionEjecucion:number);

	findById(id:number);

	add(row:EmisionCuota);

	modify(id:number, row:EmisionCuota);

	remove(id:number);

	removeByEmisionEjecucion(idEmisionEjecucion:number);

}
