import Valuacion from "../entities/valuacion";

export default interface IValuacionRepository {

	listByInmueble(idInmueble: number);

	findById(id:number);

	add(row:Valuacion);

	modify(id:number, row:Valuacion);

	remove(id:number);

	removeByInmueble(idInmueble: number);
	
}
