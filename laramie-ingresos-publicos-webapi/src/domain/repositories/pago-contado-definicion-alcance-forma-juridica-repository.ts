import PagoContadoDefinicionAlcanceFormaJuridica from "../entities/pago-contado-definicion-alcance-forma-juridica";

export default interface IPagoContadoDefinicionAlcanceFormaJuridicaRepository {

	list();

	listByPagoContadoDefinicion(idPagoContadoDefinicion: number);

	findById(id:number);

	add(row:PagoContadoDefinicionAlcanceFormaJuridica);

	modify(id:number, row:PagoContadoDefinicionAlcanceFormaJuridica);

	remove(id:number);

	removeByPagoContadoDefinicion(idPagoContadoDefinicion:number);

}
