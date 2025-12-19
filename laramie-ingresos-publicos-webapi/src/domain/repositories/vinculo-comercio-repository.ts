import VinculoComercio from "../entities/vinculo-comercio";

export default interface IVinculoComercioRepository {

	listByComercio(idComercio: number);

	findById(id:number);

	add(row:VinculoComercio);

	modify(id:number, row:VinculoComercio);

	remove(id:number);

	removeByComercio(idComercio: number);

}
