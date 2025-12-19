import CuentaCorrienteCondicionEspecial from "../entities/cuenta-corriente-condicion-especial";

export default interface ICuentaCorrienteCondicionEspecialRepository {

	list();

	listByCuenta(idCuenta: number);

	findById(id:number);

	add(row:CuentaCorrienteCondicionEspecial);

	modify(id:number, row:CuentaCorrienteCondicionEspecial);

	remove(id:number);

}
