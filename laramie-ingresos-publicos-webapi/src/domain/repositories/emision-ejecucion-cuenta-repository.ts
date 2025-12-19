import EmisionEjecucionCuenta from "../entities/emision-ejecucion-cuenta";

export default interface IEmisionEjecucionCuentaRepository {

	listResume(idEmisionEjecucion:number);

	listPublicacion(idEmisionEjecucion:number);

	list();

	listByEmisionEjecucion(idEmisionEjecucion:number);

	findById(id:number);

	findByNumero(idEmisionEjecucion:number, numero:number);

	findByCuenta(idEmisionEjecucion:number, idCuenta:number);

	add(row:EmisionEjecucionCuenta);

	addByBloque(numeroBloque:number, rows:Array<EmisionEjecucionCuenta>);

	modify(id:number, row:EmisionEjecucionCuenta);

	modifyByEmisionEjecucion(updates:Array<any>);

	remove(id:number);

	removeByEmisionEjecucion(idEmisionEjecucion:number);

}
