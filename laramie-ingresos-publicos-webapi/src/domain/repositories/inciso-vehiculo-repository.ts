import IncisoVehiculo from "../entities/inciso-vehiculo";

export default interface IIncisoVehiculoRepository {

	list();

	findById(id:number);

	add(row:IncisoVehiculo);

	modify(id:number, row:IncisoVehiculo);

	remove(id:number);

}
