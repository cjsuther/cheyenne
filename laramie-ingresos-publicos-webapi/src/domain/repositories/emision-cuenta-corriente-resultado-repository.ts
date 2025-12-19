import EmisionCuentaCorrienteResultado from "../entities/emision-cuenta-corriente-resultado";

export default interface IEmisionCuentaCorrienteResultadoRepository {

	list();
	
	listByEmisionEjecucion(idEmisionEjecucion:number);

	listByEmisionEjecucionCuenta(idEmisionEjecucionCuenta:number);

	findById(id:number);

	add(row:EmisionCuentaCorrienteResultado);

	addBlock(rows:Array<EmisionCuentaCorrienteResultado>);

	modify(id:number, row:EmisionCuentaCorrienteResultado);

	remove(id:number);

	removeByEmisionEjecucion(idEmisionEjecucion:number);

	removeByEmisionEjecucionCuenta(idEmisionEjecucionCuenta:number);

}
