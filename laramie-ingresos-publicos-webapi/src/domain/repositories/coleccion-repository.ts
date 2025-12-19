import Coleccion from "../entities/coleccion";

export default interface IColeccionRepository {

	list();

	findById(id:number);

	add(row:Coleccion);

	modify(id:number, row:Coleccion);

	remove(id:number);

	execute(row:Coleccion, idCuenta:number, idEmisionEjecucion:number, idTasa:number, idSubTasa:number, periodo:number, mes:number);

}
