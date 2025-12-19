import ClaseElemento from "../entities/clase-elemento";

export default interface IClaseElementoRepository {

	list();

	findById(id:number);

	add(row:ClaseElemento);

	modify(id:number, row:ClaseElemento);

	remove(id:number);

}
