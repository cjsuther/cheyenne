import Mensaje from "../entities/mensaje";

export default interface IMensajeRepository {

	list();

	findById(id:number);

	add(row:Mensaje);

	modify(id:number, row:Mensaje);

	remove(id:number);

}
