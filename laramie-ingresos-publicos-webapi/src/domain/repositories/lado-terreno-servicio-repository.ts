import LadoTerrenoServicio from "../entities/lado-terreno-servicio";

export default interface ILadoTerrenoServicioRepository {

	listByLadoTerreno(idLadoTerreno: number);

	findById(id:number);

	add(row:LadoTerrenoServicio);

	modify(id:number, row:LadoTerrenoServicio);

	remove(id:number);

	removeByLadoTerreno(idLadoTerreno: number);

}
