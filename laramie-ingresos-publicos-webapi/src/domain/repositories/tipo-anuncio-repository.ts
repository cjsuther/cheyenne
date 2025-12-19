import TipoAnuncio from "../entities/tipo-anuncio";

export default interface ITipoAnuncioRepository {

	list();

	findById(id:number);

	add(row:TipoAnuncio);

	modify(id:number, row:TipoAnuncio);

	remove(id:number);

}
