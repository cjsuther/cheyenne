import RecaudacionLote from "../entities/recaudacion-lote";

export default interface IRecaudacionLoteRepository {

	list();

	listControl();

	listConciliacion();

	findById(id:number);

	findByLote(numeroLote:string);

	findByNombreArchivoRecaudacion(nombreArchivoRecaudacion:string);

	add(row:RecaudacionLote);

	modify(id:number, row:RecaudacionLote);

	remove(id:number);

	onTransaction(request);

}
