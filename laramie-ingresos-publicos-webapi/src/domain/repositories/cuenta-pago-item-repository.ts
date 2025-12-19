import CuentaPagoItem from "../entities/cuenta-pago-item";

export default interface ICuentaPagoItemRepository {

	list();

	listByCuentaPago(idCuentaPago:number);

	findById(id:number);

	add(row:CuentaPagoItem);

	addByBloque(rows: Array<CuentaPagoItem>);

	modify(id:number, row:CuentaPagoItem);

	remove(id:number);

}
