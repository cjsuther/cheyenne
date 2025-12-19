import ActoProcesal from "../entities/acto-procesal";

export default interface IActoProcesalRepository {

	listByApremio(idApremio: number);

	findById(id:number);

	add(row:ActoProcesal);

	modify(id:number, row:ActoProcesal);

	remove(id:number);

	removeByApremio(idApremio: number);

}
