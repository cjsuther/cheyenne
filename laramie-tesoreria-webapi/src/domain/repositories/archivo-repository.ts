import Archivo from "../entities/archivo";

export default interface IArchivoRepository {

	list();

	listByEntidad(entidad:string, idEntidad:number);

	listByPersonaFisica(idPersonaFisica:number);

	listByPersonaJuridica(idPersonaJuridica:number);

	findById(id:number);

	add(row:Archivo);

	modify(id:number, row:Archivo);

	remove(id:number);

}
