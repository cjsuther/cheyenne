import Caja from "../entities/caja";

export default interface ICajaRepository {

	list();

	listByDependencia(idDependencia: number);

	findById(id:number);

	findByUsuario(idUsuario:number);

	add(row:Caja);

	modify(id:number, row:Caja);

	remove(id:number);

	onTransaction(request);

}
