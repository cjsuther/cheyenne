import RubroComercio from "../entities/rubro-comercio";

export default interface IRubroComercioRepository {

	listByComercio(idComercio: number);

	findById(id:number);

	add(row:RubroComercio);

	modify(id:number, row:RubroComercio);

	remove(id:number);

}