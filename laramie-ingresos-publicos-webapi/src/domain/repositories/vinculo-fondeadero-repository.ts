import VinculoFondeadero from "../entities/vinculo-fondeadero";

export default interface IVinculoFondeaderoRepository {

	listByFondeadero(idFondeadero: number);

	findById(id:number);

	add(row:VinculoFondeadero);

	modify(id:number, row:VinculoFondeadero);

	remove(id:number);

	removeByFondeadero(idFondeadero: number);

}
