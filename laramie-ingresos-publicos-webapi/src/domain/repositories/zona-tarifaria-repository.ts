import ZonaTarifaria from "../entities/zona-tarifaria";

export default interface IZonaTarifariaRepository {

	list();

	findById(id:number);

	add(row:ZonaTarifaria);

	modify(id:number, row:ZonaTarifaria);

	remove(id:number);

}
