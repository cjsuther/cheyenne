import PagoRendicionLote from "../entities/pago-rendicion-lote";

export default interface IPagoRendicionLoteRepository {

	list();

	findById(id:number);

	findByLote(numeroLote:string);

	add(row:PagoRendicionLote);

	modify(id:number, row:PagoRendicionLote);

	remove(id:number);

	onTransaction(request);

}
