import ReciboEspecialConcepto from "../entities/recibo-especial-concepto";

export default interface IReciboEspecialConceptoRepository {

	listByReciboEspecial(idReciboEspecial: number);

	findById(id:number);

	add(row:ReciboEspecialConcepto);

	modify(id:number, row:ReciboEspecialConcepto);

	remove(id:number);
	
	removeByReciboEspecial(idReciboEspecial: number);

}
