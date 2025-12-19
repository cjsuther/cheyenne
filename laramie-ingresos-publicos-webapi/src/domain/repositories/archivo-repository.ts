import Archivo from "../entities/archivo";

export default interface IArchivoRepository {

	list();

	listByEntidad(entidad:string, idEntidad:number);

	listByInmueble(idInmueble:number);

	listByComercio(idComercio:number);

	listByVehiculo(idVehiculo:number);

	listByCementerio(idCementerio:number);

	listByFondeadero(idFondeadero:number);

	listByEspecial(idEspecial:number);

	findById(id:number);

	add(row:Archivo);

	modify(id:number, row:Archivo);

	remove(id:number);

}
