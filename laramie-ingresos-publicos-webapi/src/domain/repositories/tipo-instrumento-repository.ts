import TipoInstrumento from "../entities/tipo-instrumento";

export default interface ITipoInstrumentoRepository {

	list();

	findById(id:number);

	add(row:TipoInstrumento);

	modify(id:number, row:TipoInstrumento);

	remove(id:number);

}
