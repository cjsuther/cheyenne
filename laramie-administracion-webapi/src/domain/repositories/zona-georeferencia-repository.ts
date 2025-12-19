import ZonaGeoreferencia from "../entities/zona-georeferencia";

export default interface IZonaGeoreferenciaRepository {

	list();

	findById(id:number);

	add(row:ZonaGeoreferencia);

	modify(id:number, row:ZonaGeoreferencia);

	remove(id:number);

}
