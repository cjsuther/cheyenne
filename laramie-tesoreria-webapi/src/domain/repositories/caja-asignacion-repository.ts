import CajaAsignacion from "../entities/caja-asignacion";

export default interface ICajaAsignacionRepository {

	list();

	listCierreTesoreria();

	listByCaja(idCaja: number);

	listByRecaudacionLote(idRecaudacionLote: number);

	findById(id:number);

	add(row:CajaAsignacion);

	modify(id:number, row:CajaAsignacion);

	remove(id:number);

}
