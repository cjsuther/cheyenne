import Observacion from "../entities/observacion";

export default interface IObservacionRepository {

	list();

	listByEntidad(entidad:string, idEntidad:number);

	listByInmueble(idInmueble:number);

	listByComercio(idComercio:number);

	listByVehiculo(idVehiculo:number);

	listByCementerio(idCementerio:number);

	listByFondeadero(idFondeadero:number);

	listByEspecial(idEspecial:number);

	findById(id:number);

	add(row:Observacion);

	modify(id:number, row:Observacion);

	remove(id:number);

}
