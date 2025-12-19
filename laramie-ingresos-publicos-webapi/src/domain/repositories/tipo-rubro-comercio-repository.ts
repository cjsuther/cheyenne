import TipoRubroComercio from "../entities/tipo-rubro-comercio";

export default interface ITipoRubroComercioRepository {

	list();

	findById(id:number);

	add(row:TipoRubroComercio);

	modify(id:number, row:TipoRubroComercio);

	remove(id:number);

}
