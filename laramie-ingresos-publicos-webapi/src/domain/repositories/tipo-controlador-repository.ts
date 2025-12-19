import TipoControlador from "../entities/tipo-controlador";

export default interface ITipoControladorRepository {

	list();

	findById(id:number);

	add(row:TipoControlador);

	modify(id:number, row:TipoControlador);

	remove(id:number);

}
