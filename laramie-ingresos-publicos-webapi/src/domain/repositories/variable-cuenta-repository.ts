import VariableCuenta from "../entities/variable-cuenta";

export default interface IVariableCuentaRepository {

	listByCuenta(idCuenta: number);

	findById(id:number);

	add(row:VariableCuenta);

	modify(id:number, row:VariableCuenta);

	remove(id:number);

	removeByCuenta(idCuenta: number);

}
