import TipoVehiculo from "../entities/tipo-vehiculo";

export default interface ITipoVehiculoRepository {

	list();

	findById(id:number);

	add(row:TipoVehiculo);

	modify(id:number, row:TipoVehiculo);

	remove(id:number);

}
