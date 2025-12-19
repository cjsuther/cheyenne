import MedioPago from "../entities/medio-pago";

export default interface IMedioPagoRepository {

	list();

	listByPersona(idTipoPersona:number, idPersona:number);

	findById(id:number);

	add(row:MedioPago);

	modify(id:number, row:MedioPago);

	remove(id:number);

	removeByPersona(idTipoPersona:number, idPersona:number);

}
