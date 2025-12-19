import PagoContadoDefinicionAlcanceCondicionFiscal from "../entities/pago-contado-definicion-alcance-condicion-fiscal";

export default interface IPagoContadoDefinicionAlcanceCondicionFiscalRepository {

	list();

	listByPagoContadoDefinicion(idPagoContadoDefinicion: number);

	findById(id:number);

	add(row:PagoContadoDefinicionAlcanceCondicionFiscal);

	modify(id:number, row:PagoContadoDefinicionAlcanceCondicionFiscal);

	remove(id:number);

	removeByPagoContadoDefinicion(idPagoContadoDefinicion:number);

}
