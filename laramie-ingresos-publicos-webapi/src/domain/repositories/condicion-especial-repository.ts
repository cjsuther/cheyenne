import CondicionEspecial from "../entities/condicion-especial";

export default interface ICondicionEspecialRepository {

	listByCuenta(idCuenta: number);

	listByTipoCondicionEspecial(idTipoCondicionEspecial: number);

	findById(id:number);

	add(row:CondicionEspecial);

	modify(id:number, row:CondicionEspecial);

	remove(id:number);

	removeByCuenta(idCuenta: number);

}