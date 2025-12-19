import ProcesoProgramacion from "../entities/proceso-programacion";

export default interface IProcesoProgramacionRepository {

	list();

	findById(id:number);

	add(row:ProcesoProgramacion);

	modify(id:number, row:ProcesoProgramacion);

	remove(id:number);

}
