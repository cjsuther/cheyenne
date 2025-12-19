import RegistroContableLote from "../entities/registro-contable-lote";

export default interface IRegistroContableLoteRepository {

	list();

	findById(id:number);

	findByLote(numeroLote:string);

	add(row:RegistroContableLote);

	modify(id:number, row:RegistroContableLote);

	remove(id:number);

	onTransaction(request);

}
