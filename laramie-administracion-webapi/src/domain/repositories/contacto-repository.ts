import Contacto from "../entities/contacto";

export default interface IContactoRepository {

	list();

    listByEntidad(entidad:string, idEntidad:number);

	findById(id:number);

	add(row:Contacto);

	modify(id:number, row:Contacto);

	remove(id:number);

	removeByEntidad(entidad:string, idEntidad:number);

}
