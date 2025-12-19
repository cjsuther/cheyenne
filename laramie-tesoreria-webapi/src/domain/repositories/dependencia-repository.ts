import Dependencia from "../entities/dependencia";

export default interface IDependenciaRepository {

	list();

	findById(id:number);

	add(row:Dependencia);

	modify(id:number, row:Dependencia);

	remove(id:number);

}
