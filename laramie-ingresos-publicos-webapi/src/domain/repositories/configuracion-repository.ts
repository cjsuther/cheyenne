import Configuracion from "../entities/configuracion";

export default interface IConfiguracionRepository {

	list();

	findById(id:number);

	findByNombre(nombre:string);

	add(row:Configuracion);

	modify(id:number, row:Configuracion);

	remove(id:number);

}
