import PagoContadoDefinicionAlcanceRubro from "../entities/pago-contado-definicion-alcance-rubro";

export default interface IPagoContadoDefinicionAlcanceRubroRepository {

	list();

	listByPagoContadoDefinicion(idPagoContadoDefinicion: number);

	findById(id:number);

	add(row:PagoContadoDefinicionAlcanceRubro);

	modify(id:number, row:PagoContadoDefinicionAlcanceRubro);

	remove(id:number);

	removeByPagoContadoDefinicion(idPagoContadoDefinicion:number);

}
