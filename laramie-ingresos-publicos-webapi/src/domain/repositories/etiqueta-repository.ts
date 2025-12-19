import Etiqueta from "../entities/etiqueta";

export default interface IEtiquetaRepository {

	list();

	listByEntidad(entidad:string, idEntidad:number);

	listByCodigo(codigo:string);

	listByInmueble(idInmueble:number);

	listByComercio(idComercio:number);

	listByVehiculo(idVehiculo:number);

	listByCementerio(idCementerio:number);

	listByFondeadero(idFondeadero:number);

	listByEspecial(idEspecial:number);

	findById(id:number);

	add(row:Etiqueta);

	modify(id:number, row:Etiqueta);

	remove(id:number);

}
