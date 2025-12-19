import Superficie from "../entities/superficie";

export default interface ISuperficieRepository {

	listByInmueble(idInmueble: number);

	findById(id:number);

	add(row:Superficie);

	modify(id:number, row:Superficie);

	remove(id:number);

	removeByInmueble(idInmueble: number);

}