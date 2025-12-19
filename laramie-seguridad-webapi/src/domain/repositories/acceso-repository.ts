import Acceso from "../entities/acceso";

export default interface IAccesoRepository {

	list();

	findById(id:number);

	findByIdentificador(identificador:string);

	findByLogin(identificador:string, password:string, tipoAcceso:number);

	add(row:Acceso);

	modify(id:number, row:Acceso);

	remove(id:number);

}
