import CuentaContable from "../entities/cuenta-contable";

export default interface ICuentaContableRepository {

	list();

	findById(id:number);

	add(row:CuentaContable);

	modify(id:number, row:CuentaContable);

	remove(id:number);

}
