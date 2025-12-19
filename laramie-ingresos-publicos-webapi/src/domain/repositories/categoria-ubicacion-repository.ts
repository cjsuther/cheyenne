import CategoriaUbicacion from "../entities/categoria-ubicacion";

export default interface ICategoriaUbicacionRepository {

	list();

	findById(id:number);

	add(row:CategoriaUbicacion);

	modify(id:number, row:CategoriaUbicacion);

	remove(id:number);

}
