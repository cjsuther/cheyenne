import VinculoCementerio from "../entities/vinculo-cementerio";

export default interface IVinculoCementerioRepository {

	listByCementerio(idCementerio: number);

	findById(id:number);

	add(row:VinculoCementerio);

	modify(id:number, row:VinculoCementerio);

	remove(id:number);

	removeByCementerio(idCementerio: number);

}
