import PagoContadoDefinicionFilter from "../dto/pago-contado-definicion-filter";
import PagoContadoDefinicion from "../entities/pago-contado-definicion";

export default interface IPagoContadoDefinicionRepository {

	list();

	listByFilter(pagoContadoDefinicionFilter: PagoContadoDefinicionFilter);

	findById(id:number);

	add(row:PagoContadoDefinicion);

	modify(id:number, row:PagoContadoDefinicion);

	remove(id:number);

	onTransaction(request);

}
