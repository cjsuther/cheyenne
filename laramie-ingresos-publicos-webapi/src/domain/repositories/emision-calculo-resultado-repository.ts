import EmisionCalculoResultado from "../entities/emision-calculo-resultado";

export default interface IEmisionCalculoResultadoRepository {

	list();

	listByEmisionEjecucion(idEmisionEjecucion:number);

	listByEmisionEjecucionCuenta(idEmisionEjecucionCuenta:number);

	findById(id:number);

	add(row:EmisionCalculoResultado);

	addBlock(rows:Array<EmisionCalculoResultado>);

	modify(id:number, row:EmisionCalculoResultado);

	remove(id:number);

	removeByEmisionEjecucion(idEmisionEjecucion:number);

	removeByEmisionEjecucionCuenta(idEmisionEjecucionCuenta:number);

}
