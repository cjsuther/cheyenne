import DebitoAutomatico from "../entities/debito-automatico";

export default interface IDebitoAutomaticoRepository {

	listByCuenta(idCuenta: number);

	listBySubTasa(idSubTasa: number);

	findById(id:number);

	add(row:DebitoAutomatico);

	modify(id:number, row:DebitoAutomatico);

	remove(id:number);

	removeByCuenta(idCuenta: number);

}
