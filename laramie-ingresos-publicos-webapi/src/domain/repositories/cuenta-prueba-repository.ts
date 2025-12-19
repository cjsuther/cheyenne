import CuentaPrueba from "../entities/cuenta-prueba";

export default interface ICuentaPruebaRepository {

	list();

	findById(id:number);

	findByCuenta(idCuenta:number);

	add(row:CuentaPrueba);

	modify(id:number, row:CuentaPrueba);

	remove(id:number);

}
