import VinculoVehiculo from "../entities/vinculo-vehiculo";

export default interface IVinculoVehiculoRepository {

	listByVehiculo(idVehiculo: number);

	findById(id:number);

	add(row:VinculoVehiculo);

	modify(id:number, row:VinculoVehiculo);

	remove(id:number);

	removeByVehiculo(idVehiculo: number);

}
