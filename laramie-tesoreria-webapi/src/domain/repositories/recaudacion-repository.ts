import Recaudacion from "../entities/recaudacion";

export default interface IRecaudacionRepository {

	list();

	listByLote(idRecaudacionLote:number);

	listIngresosPublicos(idsRecaudadora:number[]);

	listRegistroContable(idsRecaudadora:number[]);

	findById(id:number);

	add(row:Recaudacion);

	modify(id:number, row:Recaudacion);

	remove(id:number);

	removeByLote(idRecaudacionLote:number);

}
