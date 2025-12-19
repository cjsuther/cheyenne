import VinculoInmueble from "../entities/vinculo-inmueble";

export default interface IVinculoInmuebleRepository {

	listByInmueble(idInmueble: number);

	findById(id:number);

	add(row:VinculoInmueble);

	modify(id:number, row:VinculoInmueble);

	remove(id:number);

	removeByInmueble(idInmueble: number);

}
