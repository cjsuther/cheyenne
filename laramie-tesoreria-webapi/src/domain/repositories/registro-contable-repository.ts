import RegistroContable from "../entities/registro-contable";

export default interface IRegistroContableRepository {

	list();

	listByLote(idRegistroContableLote:number);

	findById(id:number);

	add(row:RegistroContable);

	modify(id:number, row:RegistroContable);

	remove(id:number);

}
