import PagoContadoDefinicionTipoVinculoCuenta from "../entities/pago-contado-definicion-tipo-vinculo-cuenta";

export default interface IPagoContadoDefinicionTipoVinculoCuentaRepository {

	list();

	listByPagoContadoDefinicion(idPagoContadoDefinicion: number);

	findById(id:number);

	add(row:PagoContadoDefinicionTipoVinculoCuenta);

	modify(id:number, row:PagoContadoDefinicionTipoVinculoCuenta);

	remove(id:number);

	removeByPagoContadoDefinicion(idPagoContadoDefinicion:number);

}
