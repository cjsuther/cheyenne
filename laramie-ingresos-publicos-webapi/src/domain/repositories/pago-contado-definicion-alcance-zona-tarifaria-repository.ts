import PagoContadoDefinicionAlcanceZonaTarifaria from "../entities/pago-contado-definicion-alcance-zona-tarifaria";

export default interface IPagoContadoDefinicionAlcanceZonaTarifariaRepository {

	list();

	listByPagoContadoDefinicion(idPagoContadoDefinicion: number);

	findById(id:number);

	add(row:PagoContadoDefinicionAlcanceZonaTarifaria);

	modify(id:number, row:PagoContadoDefinicionAlcanceZonaTarifaria);

	remove(id:number);

	removeByPagoContadoDefinicion(idPagoContadoDefinicion:number);

}
