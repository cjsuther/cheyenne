import ReciboPublicacionLote from "../entities/recibo-publicacion-lote";

export default interface IReciboPublicacionLoteRepository {

	list();

	findById(id:number);

	add(row:ReciboPublicacionLote);

	modify(id:number, row:ReciboPublicacionLote);

	remove(id:number);

	onTransaction(request);

}
