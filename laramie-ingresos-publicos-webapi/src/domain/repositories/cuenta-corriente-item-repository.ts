import CuentaCorrienteItemFilter from "../dto/cuenta-corriente-item-filter";
import CuentaCorrienteItemRecibo from "../dto/cuenta-corriente-item-recibo";
import CuentaCorrienteItem from "../entities/cuenta-corriente-item";

export default interface ICuentaCorrienteItemRepository {

	list();

	listByFilter(cuentaCorrienteItemFilter: CuentaCorrienteItemFilter);

	listByCuenta(idCuenta:number);

	listByTasa(idTasa:number, idSubTasa:number, periodo:string, cuota:number, idCuenta:number);
	
	listByPartida(numeroPartida:number);

	listByPlanPago(idPlanPago:number);

	listByRecibo(cuentaCorrienteRecibo: CuentaCorrienteItemRecibo);

	findById(id:number);

	add(row:CuentaCorrienteItem);

	addByBloque(rows: Array<CuentaCorrienteItem>);

	modify(id:number, row:CuentaCorrienteItem);

	remove(id:number);

	onTransaction(request);

}
