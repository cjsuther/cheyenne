import Incidencia from "../entities/incidencia";

export default interface IIncidenciaRepository {

	list();

	findById(id:number);

	add(row:Incidencia);

	modify(id:number, row:Incidencia);

	remove(id:number);

}
