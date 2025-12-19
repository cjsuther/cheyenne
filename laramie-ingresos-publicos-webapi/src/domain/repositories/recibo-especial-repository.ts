import ReciboEspecial from "../entities/recibo-especial";

export default interface IReciboEspecialRepository {

	list();

	findById(id:number);

	add(row:ReciboEspecial);

	modify(id:number, row:ReciboEspecial);

	remove(id:number);

	onTransaction(request);

}
