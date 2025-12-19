import RegistroCivil from "../entities/registro-civil";

export default interface IRegistroCivilRepository {

	list();

	findById(id:number);

	add(row:RegistroCivil);

	modify(id:number, row:RegistroCivil);

	remove(id:number);

}
