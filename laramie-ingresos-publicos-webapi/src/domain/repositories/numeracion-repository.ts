import Numeracion from "../entities/numeracion";

export default interface INumeracionRepository {

	list();

	findById(id:number);

	findByNombre(nombre:string);

	findByProximo(nombre:string);

	add(row:Numeracion);

	modify(id:number, row:Numeracion);

	modifyByNombre(nombre:string, row:Numeracion);

	remove(id:number);

}
