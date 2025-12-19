import ControladorCuenta from "../entities/controlador-cuenta";

export default interface IControladorCuentaRepository {

	list();

	listByCuenta(idCuenta: number);

	findById(id:number);

	add(row:ControladorCuenta);

	modify(id:number, row:ControladorCuenta);

	remove(id:number);

	removeByCuenta(idCuenta: number);

}
