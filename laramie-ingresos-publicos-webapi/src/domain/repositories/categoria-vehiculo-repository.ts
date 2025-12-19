import CategoriaVehiculo from "../entities/categoria-vehiculo";

export default interface ICategoriaVehiculoRepository {

	list();

	findById(id:number);

	add(row:CategoriaVehiculo);

	modify(id:number, row:CategoriaVehiculo);

	remove(id:number);

}
