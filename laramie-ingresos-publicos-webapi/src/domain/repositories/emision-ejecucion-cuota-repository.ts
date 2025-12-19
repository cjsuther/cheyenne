import EmisionEjecucionCuota from "../entities/emision-ejecucion-cuota";

export default interface IEmisionEjecucionCuotaRepository {

	list();

	listByEmisionEjecucion(idEmisionEjecucion:number, includeData: boolean);

	listByEmisionEjecucionCuenta(idEmisionEjecucionCuenta:number);

	findById(id:number);

	add(row:EmisionEjecucionCuota);

	addByBloque(rows:Array<EmisionEjecucionCuota>);

	modify(id:number, row:EmisionEjecucionCuota);

	modifyByEmisionEjecucion(updates:Array<any>);

	remove(id:number);

	removeByEmisionEjecucion(idEmisionEjecucion:number);

	removeByEmisionEjecucionCuenta(idEmisionEjecucionCuenta:number);

}
