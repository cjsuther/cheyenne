import EmisionNumeracion from "../entities/emision-numeracion";

export default interface IEmisionNumeracionRepository {

	list();

	findById(id:number);

	add(row:EmisionNumeracion);

	modify(id:number, row:EmisionNumeracion);

	remove(id:number);

}
