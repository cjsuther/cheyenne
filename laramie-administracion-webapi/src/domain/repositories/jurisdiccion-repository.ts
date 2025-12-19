import Jurisdiccion from "../entities/jurisdiccion";

export default interface IJurisdiccionRepository {

	list();

	findById(id:number);

	add(row:Jurisdiccion);

	modify(id:number, row:Jurisdiccion);

	remove(id:number);

}
