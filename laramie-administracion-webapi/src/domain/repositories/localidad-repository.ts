import Localidad from "../entities/localidad";

export default interface ILocalidadRepository {

	list();

	findById(id:number);

	add(row:Localidad);

	modify(id:number, row:Localidad);

	remove(id:number);

}
