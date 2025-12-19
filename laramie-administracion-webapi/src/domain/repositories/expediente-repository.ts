import ExpedienteFilter from "../dto/expediente-filter";
import Expediente from "../entities/expediente";

export default interface IExpedienteRepository {

	list();

	listByFilter(expedienteFilter: ExpedienteFilter);

	findById(id:number);

	add(row:Expediente);

	modify(id:number, row:Expediente);

	remove(id:number);

	onTransaction(request);

}
