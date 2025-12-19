import ReciboApertura from "../entities/recibo-apertura";

export default interface IReciboAperturaRepository {

	list();

	listByReciboPublicacion(idReciboPublicacion: number);

	findById(id:number);

	add(row:ReciboApertura);

	modify(id:number, row:ReciboApertura);

	remove(id:number);

}
