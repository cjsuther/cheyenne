import PagoContadoDefinicionAlcanceTasa from "../entities/pago-contado-definicion-alcance-tasa";

export default interface IPagoContadoDefinicionAlcanceTasaRepository {

	list();

	listByPagoContadoDefinicion(idPagoContadoDefinicion: number);

	findById(id:number);

	add(row:PagoContadoDefinicionAlcanceTasa);

	modify(id:number, row:PagoContadoDefinicionAlcanceTasa);

	remove(id:number);

	removeByPagoContadoDefinicion(idPagoContadoDefinicion:number);

}
