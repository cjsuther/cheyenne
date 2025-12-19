import TasaVencimiento from "../entities/tasa-vencimiento";

export default interface ITasaVencimientoRepository {

	list();

	findById(id:number);

	add(row:TasaVencimiento);

	addByBloque(rows: Array<TasaVencimiento>);

	modify(id:number, row:TasaVencimiento);

	remove(id:number);

}
