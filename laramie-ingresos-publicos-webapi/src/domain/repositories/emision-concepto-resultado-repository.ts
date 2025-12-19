import EmisionConceptoResultado from "../entities/emision-concepto-resultado";

export default interface IEmisionConceptoResultadoRepository {

	list();

	listByEmisionEjecucion(idEmisionEjecucion:number);

	listByEmisionEjecucionCuenta(idEmisionEjecucionCuenta:number);

	findById(id:number);

	add(row:EmisionConceptoResultado);

	addBlock(rows:Array<EmisionConceptoResultado>);

	modify(id:number, row:EmisionConceptoResultado);

	remove(id:number);

	removeByEmisionEjecucion(idEmisionEjecucion:number);

	removeByEmisionEjecucionCuenta(idEmisionEjecucionCuenta:number);

}
