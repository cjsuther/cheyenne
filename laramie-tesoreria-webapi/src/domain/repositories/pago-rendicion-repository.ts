import PagoRendicion from "../entities/pago-rendicion";

export default interface IPagoRendicionRepository {

	list();

	listByLote(idPagoRendicionLote:number);

	findById(id:number);

	add(row:PagoRendicion);

	modify(id:number, row:PagoRendicion);

	remove(id:number);

}
