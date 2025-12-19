import EmisionConcepto from "../entities/emision-concepto";

export default interface IEmisionConceptoRepository {

	list();
	
	listByEmisionDefinicion(idEmisionDefinicion:number);

	findById(id:number);

	add(row:EmisionConcepto);

	modify(id:number, row:EmisionConcepto);

	remove(id:number);

	removeByEmisionDefinicion(idEmisionDefinicion:number);

}
