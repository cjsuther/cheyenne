import LadoTerreno from "../entities/lado-terreno";

export default interface ILadoTerrenoRepository {

	listByInmueble(idInmueble: number);

	findById(id:number);

	add(row:LadoTerreno);

	modify(id:number, row:LadoTerreno);

	remove(id:number);

}
