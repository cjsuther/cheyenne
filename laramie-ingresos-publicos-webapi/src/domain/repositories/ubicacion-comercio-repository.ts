import UbicacionComercio from "../entities/ubicacion-comercio";

export default interface IUbicacionComercioRepository {

	list();

	findById(id:number);

	add(row:UbicacionComercio);

	modify(id:number, row:UbicacionComercio);

	remove(id:number);

}
