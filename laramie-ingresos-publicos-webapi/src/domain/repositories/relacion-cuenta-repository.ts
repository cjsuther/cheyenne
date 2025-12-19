import RelacionCuenta from "../entities/relacion-cuenta";

export default interface IRelacionCuentaRepository {

	listByCuenta(idCuenta: number);

	findById(id:number);

	add(row:RelacionCuenta);

	modify(id:number, row:RelacionCuenta);

	remove(id:number);

	removeByCuenta(idCuenta: number);

}
