import VinculoEspecial from "../entities/vinculo-especial";

export default interface IVinculoEspecialRepository {

	listByEspecial(idEspecial: number);

	findById(id:number);

	add(row:VinculoEspecial);

	modify(id:number, row:VinculoEspecial);

	remove(id:number);

	removeByEspecial(idEspecial: number);

}
