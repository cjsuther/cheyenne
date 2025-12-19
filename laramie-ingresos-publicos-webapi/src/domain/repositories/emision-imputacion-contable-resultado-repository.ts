import EmisionImputacionContableResultado from "../entities/emision-imputacion-contable-resultado";

export default interface IEmisionImputacionContableResultadoRepository {

	list();

	listByEmisionEjecucion(idEmisionEjecucion:number);

	listByEmisionEjecucionCuenta(idEmisionEjecucionCuenta:number);

	findById(id:number);

	add(row:EmisionImputacionContableResultado);

	addBlock(rows:Array<EmisionImputacionContableResultado>);

	modify(id:number, row:EmisionImputacionContableResultado);

	remove(id:number);

	removeByEmisionEjecucion(idEmisionEjecucion:number);

	removeByEmisionEjecucionCuenta(idEmisionEjecucionCuenta:number);

}
