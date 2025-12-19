import ColeccionCampo from "../entities/coleccion-campo";

export default interface IColeccionCampoRepository {

	listByColeccion(idColeccion: number);

	findById(id:number);

	add(row:ColeccionCampo);

	modify(id:number, row:ColeccionCampo);

	remove(id:number);

}
