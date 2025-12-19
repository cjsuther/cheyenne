import ObraInmueble from "../entities/obra-inmueble";

export default interface IObraInmuebleRepository {

	listByInmueble(idInmueble: number);

	findById(id:number);

	add(row:ObraInmueble);

	modify(id:number, row:ObraInmueble);

	remove(id:number);

}
