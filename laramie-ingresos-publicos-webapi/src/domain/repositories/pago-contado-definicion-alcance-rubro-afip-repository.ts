import PagoContadoDefinicionAlcanceRubroAfip from "../entities/pago-contado-definicion-alcance-rubro-afip";

export default interface IPagoContadoDefinicionAlcanceRubroAfipRepository {

	list();

	listByPagoContadoDefinicion(idPagoContadoDefinicion: number);

	findById(id:number);

	add(row:PagoContadoDefinicionAlcanceRubroAfip);

	modify(id:number, row:PagoContadoDefinicionAlcanceRubroAfip);

	remove(id:number);

	removeByPagoContadoDefinicion(idPagoContadoDefinicion:number);

}
