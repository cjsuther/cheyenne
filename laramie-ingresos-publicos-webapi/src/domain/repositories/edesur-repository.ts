import Edesur from "../entities/edesur";

export default interface IEdesurRepository {

	listByInmueble(idInmueble: number);

	findById(id:number);

	add(row:Edesur);

	modify(id:number, row:Edesur);

	remove(id:number);

}