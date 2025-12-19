import PagoContadoDefinicionAlcanceGrupo from "../entities/pago-contado-definicion-alcance-grupo";

export default interface IPagoContadoDefinicionAlcanceGrupoRepository {

	list();

	listByPagoContadoDefinicion(idPagoContadoDefinicion: number);

	findById(id:number);

	add(row:PagoContadoDefinicionAlcanceGrupo);

	modify(id:number, row:PagoContadoDefinicionAlcanceGrupo);

	remove(id:number);

	removeByPagoContadoDefinicion(idPagoContadoDefinicion:number);

}
