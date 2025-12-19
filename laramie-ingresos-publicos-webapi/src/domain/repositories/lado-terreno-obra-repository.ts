import LadoTerrenoObra from "../entities/lado-terreno-obra";

export default interface ILadoTerrenoObraRepository {

	listByLadoTerreno(idLadoTerreno: number);

	findById(id:number);

	add(row:LadoTerrenoObra);

	modify(id:number, row:LadoTerrenoObra);

	remove(id:number);

	removeByLadoTerreno(idLadoTerreno: number);

}
